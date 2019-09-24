"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const invoiceID_1 = require("../../domain/invoiceID");
const sqliteInvoiceRepo_1 = require("../../repos/sqlite/sqliteInvoiceRepo");
const sqliteJobRepo_1 = require("../../repos/sqlite/sqliteJobRepo");
const sqliteClientRepo_1 = require("../../repos/sqlite/sqliteClientRepo");
const db_1 = require("../../db");
const clientDTO_1 = require("../../domain/dto/clientDTO");
const cameramanDTO_1 = require("../../domain/dto/cameramanDTO");
const equipmentItemDTO_1 = require("../../domain/dto/equipmentItemDTO");
const jobDTOx_1 = require("../../domain/dto/jobDTOx");
/**
 * InvoiceChannel manages all invoice related channels
 * used by IPC for communicating with the renderer process of electron
 */
class InvoiceChannelManager {
    constructor(ipcMain, window, invoiceService) {
        this.ipcMain = ipcMain;
        this.window = window;
        this.invoiceService = invoiceService;
    }
    /**
     * initChannels initializes all channels relating
     * to invoices.
     * e.g fetchAllInvoices channel
     */
    initChannels() {
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
    initFetchAll() {
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
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    /**
     * initGenerate creates a channel for ipcMain to listen to the
     * generate invoice event and replies with the generated html of the requested invoice
     */
    initGenerate() {
        const listenChannel = 'generate-invoice-channel';
        const replyChannel = 'generate-invoice-reply-channel';
        const invoiceLocation = `file://${__dirname}/../../ui/invoice.html`;
        this.ipcMain.on(listenChannel, (event, args) => {
            try {
                const invoiceKey = 'invoiceID';
                const userKey = 'userID';
                const renderedHTML = this.invoiceService.generateInvoice(new invoiceID_1.InvoiceID(args[invoiceKey]), args[userKey]);
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
            }
            catch (e) {
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
    initSubmit() {
        const listenChannel = 'submit-invoice-channel';
        const replyChannel = 'submit-invoice-reply-channel';
        this.ipcMain.on(listenChannel, (event, args) => {
            try {
                const dbLocation = `${__dirname}/../../../db/Invoice.db`;
                const db = new db_1.DB(dbLocation);
                const sqliteJobRepo = new sqliteJobRepo_1.SqliteJobRepo(db);
                const sqliteClientRepo = new sqliteClientRepo_1.SqliteClientRepo(db);
                const sqliteInvoiceRepo = new sqliteInvoiceRepo_1.SqliteInvoiceRepo(db, sqliteJobRepo);
                const { iban, firstName, lastName, email, city, zipcode, street, houseNumber, description, location, directedBy, cameraman, equipmentItems } = args;
                let clientDTO;
                if (firstName === "" || lastName === "" || email === "" || city === "" || zipcode === "" || street === "" || houseNumber === "") {
                    event.reply(replyChannel, "All client fields should be provided of a value");
                }
                else {
                    clientDTO = new clientDTO_1.ClientDTO(firstName, lastName, email, city, street, houseNumber, zipcode);
                }
                let jobDTO;
                if (description === "" || location === "" || directedBy === "") {
                    event.reply(replyChannel, "All job fields should be provided of a value");
                }
                else {
                    jobDTO = new jobDTOx_1.JobDTO(description, location, directedBy);
                }
                let cameramanDTO;
                if (cameraman !== undefined) {
                    const { firstName, lastName, dayPrice, startDate, endDate } = cameraman;
                    if (firstName === "" || lastName === "" || dayPrice === "" || startDate === "" || endDate === "") {
                        event.reply(replyChannel, "All cameraman fields should be provided of a value");
                    }
                    else {
                        cameramanDTO = new cameramanDTO_1.CameramanDTO(firstName, lastName, dayPrice, startDate, endDate);
                    }
                }
                let equipmentItemDTOs = [];
                if (equipmentItems !== undefined) {
                    equipmentItems.forEach((e) => {
                        const { equipmentItemName, equipmentItemDayPrice, equipmentItemStartDate, equipmentItemEndDate } = e;
                        if (equipmentItemName === "" || equipmentItemDayPrice === "" || equipmentItemStartDate === "" || equipmentItemEndDate === "") {
                            event.reply(replyChannel, "All equipmentItem fields should be provided of a value");
                        }
                        else {
                            equipmentItemDTOs.push(new equipmentItemDTO_1.EquipmentItemDTO(equipmentItemName, equipmentItemDayPrice, equipmentItemStartDate, equipmentItemEndDate));
                        }
                    });
                }
                // todo: look into the ! (exclamation marks), don't really want them
                this.invoiceService.createInvoice(iban, jobDTO, clientDTO, cameramanDTO, equipmentItemDTOs);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.InvoiceChannelManager = InvoiceChannelManager;
//# sourceMappingURL=invoiceChannelManager.js.map