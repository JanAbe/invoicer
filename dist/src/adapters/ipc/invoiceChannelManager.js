"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const htmlService_1 = require("../../application/htmlService");
const util_1 = require("util");
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
                const fetchInvoiceByIDPromise = this.invoiceService.fetchInvoiceByID(args['invoiceID']);
                const fetchUserByIDPromise = this.userService.fetchUserByID(args['userID']);
                this.window.webContents.loadURL(invoiceLocation);
                Promise.all([fetchInvoiceByIDPromise, fetchUserByIDPromise])
                    .then(results => {
                    const invoiceDTO = results[0];
                    const userDTO = results[1];
                    const renderedHTML = htmlService_1.HtmlService.generateInvoiceTemplate(invoiceDTO, userDTO);
                    this.window.webContents.on('did-frame-finish-load', () => {
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
        //todo: look into valid and invalid dayPrice values
        // i entered something and it made it crash, i forgot what i entered though :c 
        // but how do i pass correct error messages back to the user?
        // or should that happen client-side during the entering of the info?
        this.ipcMain.on(listenChannel, (_, args) => {
            if (util_1.isNullOrUndefined(args)) {
                throw new Error('args is null or undefined');
            }
            const invoiceProps = {};
            const { iban, firstName, lastName, email, city, zipcode, street, houseNumber, description, location, directedBy, cameraman, equipmentItems } = args;
            invoiceProps['iban'] = iban;
            invoiceProps['client'] = { 'clientFirstName': firstName,
                'clientLastName': lastName,
                'email': email,
                'city': city,
                'zipcode': zipcode,
                'street': street,
                'houseNumber': Number(houseNumber) };
            invoiceProps['job'] = { 'description': description, 'location': location, 'directedBy': directedBy };
            invoiceProps['cameraman'] = cameraman;
            invoiceProps['equipmentItems'] = equipmentItems;
            this.invoiceService.createInvoice(invoiceProps);
        });
    }
    // todo: look into the possibility of making a general/abstract initChannel function
    // it takes. initChannel(listenChan, replyChan, succeedCallback, errorCallback)
    // where succeedCallback and errorCallback are two functions, one wil run in the try block
    // and the other will run in the catchblock
    initChannel(listenChan, replyChan, succeedCallback, errorCallback) {
        this.ipcMain.on(listenChan, (event, args) => {
            try {
                succeedCallback(args);
            }
            catch (e) {
                errorCallback();
            }
        });
    }
}
exports.InvoiceChannelManager = InvoiceChannelManager;
//# sourceMappingURL=invoiceChannelManager.js.map