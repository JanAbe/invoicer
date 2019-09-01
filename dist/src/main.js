"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var db_1 = require("./db");
var sqliteInvoiceRepo_1 = require("./repos/sqliteInvoiceRepo");
var sqliteJobRepo_1 = require("./repos/sqliteJobRepo");
var invoiceID_1 = require("./domain/invoiceID");
var job_1 = require("./domain/job");
var jobID_1 = require("./domain/jobID");
var client_1 = require("./domain/client");
var fullName_1 = require("./domain/fullName");
var email_1 = require("./domain/email");
var address_1 = require("./domain/address");
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    electron_1.app.quit();
}
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;
var createWindow = function () {
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
    });
    // and load the index.html of the app.
    mainWindow.loadURL("file://" + __dirname + "/ui/index.html");
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
    // Extract this into its own method?
    // When / which electron event should be used to call this code
    var dbLocation = __dirname + "/../db/Invoice.db";
    console.log(dbLocation);
    var db = new db_1.DB(dbLocation);
    db.createTables();
    // doesn't work yet :c
    var sqliteJobRepo = new sqliteJobRepo_1.SqliteJobRepo(db);
    var job = new job_1.Job(new jobID_1.JobID('971a63e3-2654-4954-b523-05747e1a73f5'), 'test job', 'amsterdam', 'directie', new client_1.Client(new fullName_1.FullName('tom', 'hengst'), new email_1.Email('test@email.com'), new address_1.Address('amsterdam', 'streetname', 12, '1234QQ')), undefined, undefined);
    var x = sqliteJobRepo.save(job);
    x.then(function (value) { return console.log(value); }).catch(function (err) { return console.log(err); });
    var sqliteInvoiceRepo = new sqliteInvoiceRepo_1.SqliteInvoiceRepo(db, sqliteJobRepo);
    var invoice = sqliteInvoiceRepo.invoiceOfID(new invoiceID_1.InvoiceID("6ccc310d-4734-4c36-8390-525be0739ed7"));
    invoice.then(function (value) { return console.log(value); }).catch(function (err) { return console.log(err); });
};
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.on('ready', createWindow);
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
