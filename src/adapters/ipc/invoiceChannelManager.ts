import { IpcMain, BrowserWindow } from "electron";
import { InvoiceService } from '../../services/invoiceService';
import { ChannelManager } from "./channelManager";

/**
 * InvoiceChannel manages all invoice related channels
 * used by IPC for communicating with the renderer process of electron
 */
export class InvoiceChannelManager implements ChannelManager {
    private readonly ipcMain: IpcMain;
    private window: BrowserWindow;
    private readonly invoiceService: InvoiceService;

    constructor(ipcMain: IpcMain, window: BrowserWindow, invoiceService: InvoiceService) {
        this.ipcMain = ipcMain;
        this.window = window;
        this.invoiceService = invoiceService;
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
    
    // todo: use nunjucks to render html. create templates and extend from other templates
    // this will reduce code (html) duplication. Atm each file has the same navbar html
    // which is just duplication and more error prone
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
                const invoiceKey = 'invoiceID';
                const userKey = 'userID';
                // todo: check if args[invoiceKey] and args[userKey] aren't undefined
                if (args[invoiceKey] === "" || args[userKey] === "") {
                    event.reply(replyChannel, "Invoice and user id need to be supplied");
                    throw new Error("Invoice and User id need to be supplied");
                }

                const renderedHTML = this.invoiceService.generateInvoice(
                    args[invoiceKey], args[userKey]
                );

                renderedHTML
                .then(html => {
                    this.window.loadURL(invoiceLocation);
                    this.window.webContents.on('did-finish-load', () => {
                        event.reply(replyChannel, html);
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

    // todo: add checks to see if cameraman and equipmentitem data has been passed
    // also check if at least 1 of the 2 has been passed
    /**
     * initSubmit creates a channel for ipcMain to listen to the
     * submit invoice event.
     */
    private initSubmit(): void {
        const listenChannel = 'submit-invoice-channel';
        const replyChannel = 'submit-invoice-reply-channel';

        this.ipcMain.on(listenChannel, (event, args) => {
            try {
                const invoiceProps: any = {};
                const { iban, firstName, lastName, 
                        email, city, zipcode, street, 
                        houseNumber, description, location, 
                        directedBy, cameraman, equipmentItems } = args; 
                
                if (iban === "") {
                    event.reply(replyChannel, "Iban should be provided of a value");
                    throw new Error("Iban should be provided of a value");
                }

                invoiceProps['iban'] = iban;

                if (firstName === "" || lastName === "" || email === "" || city === "" || zipcode === "" || street === "" || houseNumber === "") {
                    event.reply(replyChannel, "All client fields should be provided of a value");
                    throw new Error("All client fields should be provided of a value");
                } 

                invoiceProps['client'] = {'clientFirstName': firstName, 
                                          'clientLastName': lastName,
                                          'email': email,
                                          'city': city,
                                          'zipcode': zipcode,
                                          'street': street,
                                          'houseNumber': Number(houseNumber)}

                if (description === "" || location === "" || directedBy === "") {
                    event.reply(replyChannel, "All job fields should be provided of a value");
                    throw new Error("All job fields should be provided of a value");
                }

                invoiceProps['job'] = {'description': description, 'location': location, 'directedBy': directedBy};

                if (cameraman !== undefined) {
                    const { firstName, lastName, dayPrice, startDate, endDate } = cameraman;
                    if (firstName === "" || lastName === "" || dayPrice === "" || startDate === "" || endDate === "") {
                        event.reply(replyChannel, "All cameraman fields should be provided of a value");
                        throw new Error("All cameraman fields should be provided of a value");
                    }
                    
                    invoiceProps['cameraman'] = cameraman;
                }

                if (equipmentItems !== undefined) {
                    equipmentItems.forEach((e: any) => {
                        const { equipmentItemName, equipmentItemDayPrice, equipmentItemStartDate, equipmentItemEndDate } = e; 
                        if (equipmentItemName === "" || equipmentItemDayPrice === "" || equipmentItemStartDate === "" || equipmentItemEndDate === "") {
                            event.reply(replyChannel, "All equipmentItem fields should be provided of a value");
                            throw new Error("All equipmentItem fields should be provided of a value");
                        } 
                    });

                    invoiceProps['equipmentItems'] = equipmentItems;
                }

                this.invoiceService.createInvoice(invoiceProps);
            } catch (e) {
                console.log(e);
            }
        });
    }
}