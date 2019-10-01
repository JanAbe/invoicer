import { IpcMain, BrowserWindow } from "electron";
import { InvoiceService } from '../../application/invoiceService';
import { ChannelManager } from "./channelManager";
import { HtmlService } from "../../application/htmlService";
import { UserService } from "../../application/userService";
import { isNullOrUndefined } from "util";

/**
 * InvoiceChannel manages all invoice related channels
 * used by IPC for communicating with the renderer process of electron
 */
export class InvoiceChannelManager implements ChannelManager {
    private readonly ipcMain: IpcMain;
    private window: BrowserWindow;
    private readonly invoiceService: InvoiceService;
    private readonly userService: UserService;

    constructor(ipcMain: IpcMain, window: BrowserWindow, invoiceService: InvoiceService, userService: UserService) {
        this.ipcMain = ipcMain;
        this.window = window;
        this.invoiceService = invoiceService;
        this.userService = userService;
    }

    /**
     * initChannels initializes all channels relating
     * to invoices. 
     * e.g fetchAllInvoices channel
     */
    public initChannels(): void {
        this.initFetchAll();
        this.initGenerate();
        this.initSubmit();
    }

    /**
     * fetchAll creates a channel for ipcMain to listen to the
     * fetch all invoices event and replies with all the rendered html of the fetched invoices
     */
    private initFetchAll(): void {
        const listenChannel = 'fetch-all-invoices-channel';
        const replyChannel = 'fetch-all-invoices-reply-channel';

        this.ipcMain.on(listenChannel, (event, _) => {
            try {
                this.invoiceService.fetchAllInvoices()
                .then(invoiceDTOs => {
                    return HtmlService.generateAllInvoiceTemplates(invoiceDTOs);
                })
                .then(renderedHTML => {
                    event.reply(replyChannel, renderedHTML);
                })
                .catch(err => {
                    console.log(err);
                });
            } catch (e) {
                console.log(e);
            }
        });
    }

    /**
     * initGenerate creates a channel for ipcMain to listen to the
     * generate invoice event and replies with the generated html of the requested invoice
     */
    private initGenerate(): void {
        const listenChannel = 'generate-invoice-channel';
        const replyChannel = 'generate-invoice-reply-channel';
        const invoiceLocation = `file://${__dirname}/../../ui/invoice.html`;

        this.ipcMain.on(listenChannel, (event, args) => {
            try {
                const fetchInvoiceByIDPromise = this.invoiceService.fetchInvoiceByID(args['invoiceID'])
                const fetchUserByIDPromise = this.userService.fetchUserByID(args['userID']);

                Promise.all([fetchInvoiceByIDPromise, fetchUserByIDPromise])
                .then(results => {
                    const invoiceDTO = results[0];
                    const userDTO = results[1];
                    const renderedHTML = HtmlService.generateInvoiceTemplate(invoiceDTO, userDTO);

                    this.window.webContents.loadURL(invoiceLocation);
                    this.window.webContents.on('did-finish-load', () => {
                        event.reply(replyChannel, renderedHTML);
                    });
                })
                .catch(err => {
                    console.log(err);
                });
            } catch (e) {
                console.log(e);
            }
        });
    }

    /**
     * initSubmit creates a channel for ipcMain to listen to the
     * submit invoice event.
     */
    private initSubmit(): void {
        const listenChannel = 'submit-invoice-channel';
        const replyChannel = 'submit-invoice-reply-channel';

        this.ipcMain.on(listenChannel, (_, args) => {
            if (isNullOrUndefined(args)) {
                throw new Error('args is null or undefined');
            }

            const invoiceProps: any = {};
            const { iban, firstName, lastName, 
                    email, city, zipcode, street, 
                    houseNumber, description, location, 
                    directedBy, cameraman, equipmentItems } = args; 

            invoiceProps['iban'] = iban;
            invoiceProps['client'] = {'clientFirstName': firstName, 
                                        'clientLastName': lastName,
                                        'email': email,
                                        'city': city,
                                        'zipcode': zipcode,
                                        'street': street,
                                        'houseNumber': Number(houseNumber)}
            invoiceProps['job'] = {'description': description, 'location': location, 'directedBy': directedBy};
            invoiceProps['cameraman'] = cameraman;
            invoiceProps['equipmentItems'] = equipmentItems;
            this.invoiceService.createInvoice(invoiceProps);
        });
    }

    private initChannel(listenChan: string, replyChan: string, succeedCallback: (args: any) => void, errorCallback: () => void) {
        this.ipcMain.on(listenChan, (event, args) => {
            try {
                succeedCallback(args);
            } catch (e) {
                errorCallback();
            }
        });
    }
}