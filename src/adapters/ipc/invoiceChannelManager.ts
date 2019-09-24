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

                const requiredKeys: string[] = ['firstName', 'lastName', 
                                                'email', 'city', 
                                                'street', 'houseNumber', 
                                                'zipcode', 'description', 
                                                'location', 'directedBy'];
                requiredKeys.forEach((key) => {
                    if (args[key] === '') {
                        const errorMsg = `${key} missing. This field should be provided of a value.`;
                        event.reply(replyChannel, errorMsg);
                        throw new Error(errorMsg);
                    }
                });

                const jobID = sqliteJobRepo.nextID();
                const invoiceID = sqliteInvoiceRepo.nextID();
                const clientID = sqliteClientRepo.nextID();
                let cameraman: any = undefined;

                if (args.hasOwnProperty('cameraman')) {
                    // todo: add check to see if properties aren't empty
                    cameraman = new Cameraman(args['cameraman']['firstName'],
                        args['cameraman']['lastName'],
                        Number(args['cameraman']['dayPrice']),
                        new Period(new Date(args['cameraman']['startDate']),
                            new Date(args['cameraman']['endDate'])));
                }

                const client = new Client(clientID,
                    new FullName(args['firstName'],
                        args['lastName']),
                    new Email(args['email']),
                    new Address(args['city'],
                        args['street'],
                        Number(args['houseNumber']),
                        args['zipcode']));

                const job = new Job(jobID,
                    args['description'],
                    args['location'],
                    args['directedBy'],
                    clientID,
                    cameraman);

                if (args.hasOwnProperty('equipmentItems')) {
                    // todo: add check to see if properties aren't empty
                    for (let item of args['equipmentItems']) {
                        job.equipmentItems.push(new EquipmentItem(item['equipmentItemName'],
                            item['equipmentItemDayPrice'],
                            new Period(new Date(item['equipmentItemStartDate']), new Date(item['equipmentItemEndDate']))));
                    }
                }

                // temporary, need to figur out how to store a client
                // via its own repo? or via the job repo?
                sqliteClientRepo.save(client);
                const invoice = new Invoice(invoiceID, jobID, args['iban']);
                this.invoiceService.createInvoice(invoice, job);
            } catch (e) {
                console.log(e);
            }
        });
    }
}