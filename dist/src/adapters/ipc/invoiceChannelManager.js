"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const htmlService_1 = require("../../application/htmlService");
/**
 * InvoiceChannel manages all invoice related channels
 * used by IPC for communicating with the renderer process of electron
 */
class InvoiceChannelManager {
    constructor(ipcMain, window, invoiceService, userService) {
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
                    .then(invoiceDTOs => {
                    return htmlService_1.HtmlService.generateAllInvoiceTemplates(invoiceDTOs);
                })
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
                if (args[invoiceKey] === "" || args[userKey] === "") {
                    event.reply(replyChannel, "Invoice and user id need to be supplied");
                    throw new Error("Invoice and User id need to be supplied");
                }
                const fetchInvoiceByIDPromise = this.invoiceService.fetchInvoiceByID(args[invoiceKey]);
                const fetchUserByIDPromise = this.userService.fetchUserByID(args[userKey]);
                Promise.all([fetchInvoiceByIDPromise, fetchUserByIDPromise])
                    .then(results => {
                    const invoiceDTO = results[0];
                    const userDTO = results[1];
                    const renderedHTML = htmlService_1.HtmlService.generateInvoiceTemplate(invoiceDTO, userDTO);
                    this.window.loadURL(invoiceLocation);
                    this.window.webContents.on('did-finish-load', () => {
                        event.reply(replyChannel, renderedHTML);
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
    /**
     * initSubmit creates a channel for ipcMain to listen to the
     * submit invoice event.
     */
    initSubmit() {
        const listenChannel = 'submit-invoice-channel';
        const replyChannel = 'submit-invoice-reply-channel';
        // todo: maybe remove all checks to see if the key is empty
        // and move these checks to the domain classes
        // then just pass the args to the invoiceService method
        this.ipcMain.on(listenChannel, (event, args) => {
            try {
                const invoiceProps = {};
                const { iban, firstName, lastName, email, city, zipcode, street, houseNumber, description, location, directedBy, cameraman, equipmentItems } = args;
                if (iban === "") {
                    event.reply(replyChannel, "Iban should be provided of a value");
                    throw new Error("Iban should be provided of a value");
                }
                invoiceProps['iban'] = iban;
                if (firstName === "" || lastName === "" || email === "" || city === "" || zipcode === "" || street === "" || houseNumber === "") {
                    event.reply(replyChannel, "All client fields should be provided of a value");
                    throw new Error("All client fields should be provided of a value");
                }
                invoiceProps['client'] = { 'clientFirstName': firstName,
                    'clientLastName': lastName,
                    'email': email,
                    'city': city,
                    'zipcode': zipcode,
                    'street': street,
                    'houseNumber': Number(houseNumber) };
                if (description === "" || location === "" || directedBy === "") {
                    event.reply(replyChannel, "All job fields should be provided of a value");
                    throw new Error("All job fields should be provided of a value");
                }
                invoiceProps['job'] = { 'description': description, 'location': location, 'directedBy': directedBy };
                if (cameraman !== undefined) {
                    const { firstName, lastName, dayPrice, startDate, endDate } = cameraman;
                    if (firstName === "" || lastName === "" || dayPrice === "" || startDate === "" || endDate === "") {
                        event.reply(replyChannel, "All cameraman fields should be provided of a value");
                        throw new Error("All cameraman fields should be provided of a value");
                    }
                    invoiceProps['cameraman'] = cameraman;
                }
                if (equipmentItems !== undefined) {
                    equipmentItems.forEach((e) => {
                        const { equipmentItemName, equipmentItemDayPrice, equipmentItemStartDate, equipmentItemEndDate } = e;
                        if (equipmentItemName === "" || equipmentItemDayPrice === "" || equipmentItemStartDate === "" || equipmentItemEndDate === "") {
                            event.reply(replyChannel, "All equipmentItem fields should be provided of a value");
                            throw new Error("All equipmentItem fields should be provided of a value");
                        }
                    });
                    invoiceProps['equipmentItems'] = equipmentItems;
                }
                this.invoiceService.createInvoice(invoiceProps);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    // todo: look into the possibility of making a general/abstract initChannel function
    // it takes. initChannel(listenChan, replyChan, succeedCallback, errorCallback)
    // where succeedCallback and errorCallback are two functions, one wil run in the try block
    // and the other will run in the catchblock
    // todo: replace any type with a better function describing type
    initChannel(listenChan, replyChan, succeedCallback, errorCallback) {
        this.ipcMain.on(listenChan, (event, args) => {
            try {
                succeedCallback();
            }
            catch (e) {
                errorCallback();
            }
        });
    }
}
exports.InvoiceChannelManager = InvoiceChannelManager;
//# sourceMappingURL=invoiceChannelManager.js.map