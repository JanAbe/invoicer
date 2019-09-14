"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var db_1 = require("./db");
var sqliteInvoiceRepo_1 = require("./repos/sqliteInvoiceRepo");
var sqliteJobRepo_1 = require("./repos/sqliteJobRepo");
var invoiceID_1 = require("./domain/invoiceID");
var invoice_1 = require("./domain/invoice");
var job_1 = require("./domain/job");
var client_1 = require("./domain/client");
var fullName_1 = require("./domain/fullName");
var email_1 = require("./domain/email");
var address_1 = require("./domain/address");
var cameraman_1 = require("./domain/cameraman");
var period_1 = require("./domain/period");
var sqliteClientRepo_1 = require("./repos/sqliteClientRepo");
var equipmentItem_1 = require("./domain/equipmentItem");
var invoiceService_1 = require("./services/invoiceService");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    electron_1.app.quit();
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;
var contents;
var dbLocation = __dirname + "/../db/Invoice.db";
var db = new db_1.DB(dbLocation);
db.createTables();
var sqliteJobRepo = new sqliteJobRepo_1.SqliteJobRepo(db);
var sqliteClientRepo = new sqliteClientRepo_1.SqliteClientRepo(db);
var sqliteInvoiceRepo = new sqliteInvoiceRepo_1.SqliteInvoiceRepo(db, sqliteJobRepo);
var invoiceService = new invoiceService_1.InvoiceService(sqliteInvoiceRepo, sqliteJobRepo, sqliteClientRepo);
var createWindow = function () {
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    contents = mainWindow.webContents;
    // and load the index.html of the app.
    mainWindow.loadURL("file://" + __dirname + "/ui/home.html");
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', createWindow);
electron_1.app.on('ready', function () {
    // todo: improve this, create file with correct name and location
    electron_1.globalShortcut.register('CommandOrControl+p', function () {
        contents.print({});
    });
});
// Quit when all windows are closed.
electron_1.app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
// todo: test if it works
// listen for fetchAllInvoices event
electron_1.ipcMain.on('fetch-all-invoices-channel', function (event, _) {
    try {
        invoiceService.fetchAllInvoices()
            .then(function (html) {
            event.reply('fetch-all-invoices-reply-channel', html);
        })
            .catch(function (err) {
            console.log(err);
        });
    }
    catch (e) {
        console.log(e);
    }
});
// listen for fetched invoices
electron_1.ipcMain.on('fetch-invoice-channel', function (event, args) {
    try {
        var invoiceKey = 'invoiceID';
        if (!args.hasOwnProperty(invoiceKey)) {
            event.reply('fetch-invoice-reply-channel', invoiceKey + " key missing -> no invoiceID provided");
        }
        var invoiceHTML = invoiceService.generatePDF(new invoiceID_1.InvoiceID(args[invoiceKey]));
        invoiceHTML
            .then(function (html) {
            mainWindow.loadURL("file://" + __dirname + "/ui/invoice.html");
            mainWindow.webContents.on('did-finish-load', function () {
                event.reply('fetch-invoice-reply-channel', html);
            });
        })
            .catch(function (err) {
            console.log(err);
        });
    }
    catch (e) {
        console.log(e);
    }
});
// listen for submitted invoices
// todo: add checks to see if cameraman and equipmentitem data has been passed
// also check if at least 1 of the 2 has been passed
electron_1.ipcMain.on('submit-invoice-channel', function (event, args) {
    try {
        var props = ['firstName', 'lastName',
            'email', 'city',
            'street', 'houseNumber',
            'zipcode', 'description',
            'location', 'directedBy'];
        props.forEach(function (key) {
            if (!args.hasOwnProperty(key)) {
                event.reply('submit-invoice-reply-channel', key + " missing. All fields should be provided of a value.");
            }
            ;
        });
        var jobID = sqliteJobRepo.nextID();
        var invoiceID = sqliteInvoiceRepo.nextID();
        var clientID = sqliteClientRepo.nextID();
        // if cameraman props are in args ->
        var cameraman = new cameraman_1.Cameraman(args['cameramanFirstName'], args['cameramanLastName'], Number(args['cameramanDayPrice']), new period_1.Period(new Date(args['cameramanStartDate']), new Date(args['cameramanEndDate'])));
        var client = new client_1.Client(clientID, new fullName_1.FullName(args['firstName'], args['lastName']), new email_1.Email(args['email']), new address_1.Address(args['city'], args['street'], Number(args['houseNumber']), args['zipcode']));
        var job = new job_1.Job(jobID, args['description'], args['location'], args['directedBy'], clientID, cameraman);
        // if equipmentItems is in args and it's not empty ->
        for (var _i = 0, _a = args['equipmentItems']; _i < _a.length; _i++) {
            var item = _a[_i];
            job.equipmentItems.push(new equipmentItem_1.EquipmentItem(item['equipmentItemName'], item['equipmentItemDayPrice'], new period_1.Period(new Date(item['equipmentItemStartDate']), new Date(item['equipmentItemEndDate']))));
        }
        // temporary, need to figur out how to store a client
        // via its own repo? or via the job repo?
        sqliteClientRepo.save(client);
        var invoice = new invoice_1.Invoice(invoiceID, jobID, args['iban']);
        invoiceService.createInvoice(invoice, job);
    }
    catch (e) {
        console.log(e);
    }
});
//# sourceMappingURL=main.js.map