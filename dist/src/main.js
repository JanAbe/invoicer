"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const db_1 = require("./db");
const sqliteInvoiceRepo_1 = require("./repos/sqlite/sqliteInvoiceRepo");
const sqliteJobRepo_1 = require("./repos/sqlite/sqliteJobRepo");
const invoiceID_1 = require("./domain/invoiceID");
const invoice_1 = require("./domain/invoice");
const job_1 = require("./domain/job");
const client_1 = require("./domain/client");
const fullName_1 = require("./domain/fullName");
const email_1 = require("./domain/email");
const address_1 = require("./domain/address");
const cameraman_1 = require("./domain/cameraman");
const period_1 = require("./domain/period");
const sqliteClientRepo_1 = require("./repos/sqlite/sqliteClientRepo");
const equipmentItem_1 = require("./domain/equipmentItem");
const invoiceService_1 = require("./services/invoiceService");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    electron_1.app.quit();
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const dbLocation = `${__dirname}/../db/Invoice.db`;
const db = new db_1.DB(dbLocation);
db.createTables();
const sqliteJobRepo = new sqliteJobRepo_1.SqliteJobRepo(db);
const sqliteClientRepo = new sqliteClientRepo_1.SqliteClientRepo(db);
const sqliteInvoiceRepo = new sqliteInvoiceRepo_1.SqliteInvoiceRepo(db, sqliteJobRepo);
const invoiceService = new invoiceService_1.InvoiceService(sqliteInvoiceRepo, sqliteJobRepo, sqliteClientRepo);
const createWindow = () => {
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(`file://${__dirname}/ui/home.html`);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
// todo: use nunjucks to render html. create templates and extend from other templates
// this will reduce code (html) duplication. Atm each file has the same navbar html
// which is just duplication and more error prone
// todo: extract ipcMain code to other file(s) to clean up main.ts
electron_1.ipcMain.on('fetch-all-invoices-channel', (event, _) => {
    try {
        invoiceService.fetchAllInvoices()
            .then(html => {
            event.reply('fetch-all-invoices-reply-channel', html);
        })
            .catch(err => {
            console.log(err);
        });
    }
    catch (e) {
        console.log(e);
    }
});
// listen for fetched invoices
electron_1.ipcMain.on('generate-invoice-channel', (event, args) => {
    try {
        const invoiceKey = 'invoiceID';
        const invoiceHTML = invoiceService.generateInvoice(new invoiceID_1.InvoiceID(args[invoiceKey]));
        invoiceHTML
            .then(html => {
            mainWindow.loadURL(`file://${__dirname}/ui/invoice.html`);
            mainWindow.webContents.on('did-finish-load', () => {
                event.reply('generate-invoice-reply-channel', html);
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
// todo: add user table to db containing all general info data
// like iban, name, etc.
// listen for submitted invoices
// todo: add checks to see if cameraman and equipmentitem data has been passed
// also check if at least 1 of the 2 has been passed
electron_1.ipcMain.on('submit-invoice-channel', (event, args) => {
    try {
        const requiredKeys = ['firstName', 'lastName',
            'email', 'city',
            'street', 'houseNumber',
            'zipcode', 'description',
            'location', 'directedBy'];
        requiredKeys.forEach((key) => {
            if (args[key] === '') {
                const errorMsg = `${key} missing. This field should be provided of a value.`;
                event.reply('submit-invoice-error-channel', errorMsg);
                throw new Error(errorMsg);
            }
        });
        const jobID = sqliteJobRepo.nextID();
        const invoiceID = sqliteInvoiceRepo.nextID();
        const clientID = sqliteClientRepo.nextID();
        let cameraman = undefined;
        if (args.hasOwnProperty('cameraman')) {
            // todo: add check to see if properties aren't empty
            cameraman = new cameraman_1.Cameraman(args['cameraman']['firstName'], args['cameraman']['lastName'], Number(args['cameraman']['dayPrice']), new period_1.Period(new Date(args['cameraman']['startDate']), new Date(args['cameraman']['endDate'])));
        }
        const client = new client_1.Client(clientID, new fullName_1.FullName(args['firstName'], args['lastName']), new email_1.Email(args['email']), new address_1.Address(args['city'], args['street'], Number(args['houseNumber']), args['zipcode']));
        const job = new job_1.Job(jobID, args['description'], args['location'], args['directedBy'], clientID, cameraman);
        if (args.hasOwnProperty('equipmentItems')) {
            // todo: add check to see if properties aren't empty
            for (let item of args['equipmentItems']) {
                job.equipmentItems.push(new equipmentItem_1.EquipmentItem(item['equipmentItemName'], item['equipmentItemDayPrice'], new period_1.Period(new Date(item['equipmentItemStartDate']), new Date(item['equipmentItemEndDate']))));
            }
        }
        // temporary, need to figur out how to store a client
        // via its own repo? or via the job repo?
        sqliteClientRepo.save(client);
        const invoice = new invoice_1.Invoice(invoiceID, jobID, args['iban']);
        invoiceService.createInvoice(invoice, job);
    }
    catch (e) {
        console.log(e);
    }
});
//# sourceMappingURL=main.js.map