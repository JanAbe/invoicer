import { IpcMain, BrowserWindow } from "electron";
import { InvoiceService } from '../../services/invoiceService';
import { InvoiceID } from "../../domain/invoiceID";
import { Cameraman } from "../../domain/cameraman";
import { Period } from "../../domain/period";
import { Client } from "../../domain/client";
import { FullName } from "../../domain/fullName";
import { Email } from "../../domain/email";
import { Address } from "../../domain/address";
import { Job } from "../../domain/job";
import { EquipmentItem } from "../../domain/equipmentItem";
import { Invoice } from "../../domain/invoice";
import { SqliteInvoiceRepo } from "../../repos/sqlite/sqliteInvoiceRepo";
import { SqliteJobRepo } from "../../repos/sqlite/sqliteJobRepo";
import { SqliteClientRepo } from "../../repos/sqlite/sqliteClientRepo";
import { DB } from "../../db";
import { ChannelManager } from "./channelManager";
import { ClientDTO } from "../../domain/dto/clientDTO";
import { CameramanDTO } from "../../domain/dto/cameramanDTO";
import { EquipmentItemDTO } from "../../domain/dto/equipmentItemDTO";
import { JobDTO } from "../../domain/dto/jobDTOx";

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
                const renderedHTML = this.invoiceService.generateInvoice(
                    new InvoiceID(args[invoiceKey]), args[userKey]
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
                const dbLocation = `${__dirname}/../../../db/Invoice.db`;
                const db = new DB(dbLocation);
                const sqliteJobRepo = new SqliteJobRepo(db);
                const sqliteClientRepo = new SqliteClientRepo(db);
                const sqliteInvoiceRepo = new SqliteInvoiceRepo(db, sqliteJobRepo);

                const { iban, firstName, lastName, 
                        email, city, zipcode, street, 
                        houseNumber, description, location, 
                        directedBy, cameraman, equipmentItems } = args; 

                let clientDTO: ClientDTO;
                if (firstName === "" || lastName === "" || email === "" || city === "" || zipcode === "" || street === "" || houseNumber === "") {
                    event.reply(replyChannel, "All client fields should be provided of a value");
                } else {
                    clientDTO = new ClientDTO(firstName, lastName, email, city, street, houseNumber, zipcode);
                }

                let jobDTO: JobDTO;
                if (description === "" || location === "" || directedBy === "") {
                    event.reply(replyChannel, "All job fields should be provided of a value");
                } else {
                    jobDTO = new JobDTO(description, location, directedBy);
                }

                let cameramanDTO: CameramanDTO;
                if (cameraman !== undefined) {
                    const { firstName, lastName, dayPrice, startDate, endDate } = cameraman;
                    if (firstName === "" || lastName === "" || dayPrice === "" || startDate === "" || endDate === "") {
                        event.reply(replyChannel, "All cameraman fields should be provided of a value");
                    } else {
                        cameramanDTO = new CameramanDTO(firstName, lastName, dayPrice, startDate, endDate);
                    }
                }

                let equipmentItemDTOs: EquipmentItemDTO[] = [];
                if (equipmentItems !== undefined) {
                    equipmentItems.forEach((e: any) => {
                        const { equipmentItemName, equipmentItemDayPrice, equipmentItemStartDate, equipmentItemEndDate } = e; 
                        if (equipmentItemName === "" || equipmentItemDayPrice === "" || equipmentItemStartDate === "" || equipmentItemEndDate === "") {
                            event.reply(replyChannel, "All equipmentItem fields should be provided of a value");
                        } else {
                            equipmentItemDTOs.push(new EquipmentItemDTO(equipmentItemName, equipmentItemDayPrice, equipmentItemStartDate, equipmentItemEndDate));
                        }
                    });
                }

                // todo: look into the ! (exclamation marks), don't really want them
                this.invoiceService.createInvoice(iban, jobDTO!, clientDTO!, cameramanDTO!, equipmentItemDTOs);
            } catch (e) {
                console.log(e);
            }
        });
    }
}