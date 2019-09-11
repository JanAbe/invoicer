"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var db_1 = require("./db");
var sqliteInvoiceRepo_1 = require("./repos/sqliteInvoiceRepo");
var sqliteJobRepo_1 = require("./repos/sqliteJobRepo");
var invoiceID_1 = require("./domain/invoiceID");
var invoice_1 = require("./domain/invoice");
var job_1 = require("./domain/job");
var jobID_1 = require("./domain/jobID");
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
var dbLocation = __dirname + "/../db/Invoice.db";
var db = new db_1.DB(dbLocation);
db.createTables();
var sqliteJobRepo = new sqliteJobRepo_1.SqliteJobRepo(db);
var sqliteClientRepo = new sqliteClientRepo_1.SqliteClientRepo(db);
var sqliteInvoiceRepo = new sqliteInvoiceRepo_1.SqliteInvoiceRepo(db, sqliteJobRepo);
var createWindow = function () {
    // Create the browser window.
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
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
    var jobID = new jobID_1.JobID('8c2853c2-f2d7-44e1-bab8-2e934ed5e276');
    var job = sqliteJobRepo.jobOfID(jobID);
    job.then(function (val) {
        // console.log(val)
    }).catch(function (err) { return console.log(err); });
    // Extract this into its own method?
    // When / which electron event should be used to call this code
    // const dbLocation = `${__dirname}/../db/Invoice.db`;
    // const db = new DB(dbLocation);
    // db.createTables();
    // const sqliteJobRepo = new SqliteJobRepo(db);
    // const job = new Job(new JobID('971a63e3-2654-4954-b523-05747e1a73f5'), 'test job', 'amsterdam', 'directie', 
    //                     new Client(new FullName('tom', 'hengst'), new Email('test@email.com'), new Address('amsterdam', 'streetname', 12, '1234QQ')), 
    //                     undefined, 
    //                     undefined);
    // const rowID = sqliteJobRepo.save(job);
    // rowID.then(value => console.log(value)).catch(err => console.log(err));
    // const job = sqliteJobRepo.jobOfID(new JobID("4c9236a2-f7ad-41df-8ca9-674e0c76b97b"));
    // console.log(jobDTO);
    // job
    //   .then((value) => {
    //     console.log(value);
    //   })
    //   .catch(err => console.log(err));
    // console.log("\n");
    // const sqliteInvoiceRepo = new SqliteInvoiceRepo(db, sqliteJobRepo);
    // const invoice = sqliteInvoiceRepo.invoiceOfID(new InvoiceID("6ccc310d-4734-4c36-8390-525be0739ed7"));
    // invoice.then(value => console.log(value)).catch(err => console.log(err));
    // sqliteInvoiceRepo.save(new Invoice(
    //   sqliteInvoiceRepo.nextID(),
    //   new JobID('4c9236a2-f7ad-41df-8ca9-674e0c76b97b'),
    //   '34534234'
    // ), new Job());
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
electron_1.ipcMain.on('fetch-invoice-channel', function (event, args) {
    var invoiceKey = 'invoiceID';
    if (!args.hasOwnProperty(invoiceKey)) {
        event.reply('fetch-invoice-reply-channel', invoiceKey + " key missing -> no invoiceID provided");
    }
    var invoiceService = new invoiceService_1.InvoiceService(sqliteInvoiceRepo, sqliteJobRepo, sqliteClientRepo);
    var invoiceHTML = invoiceService.generatePDF(new invoiceID_1.InvoiceID(args[invoiceKey]));
    invoiceHTML
        .then(function (html) {
        event.reply('fetch-invoice-reply-channel', html);
    })
        .catch(function (err) {
        console.log(err);
    });
});
// listen for submitted invoices
electron_1.ipcMain.on('submit-invoice-channel', function (event, args) {
    try {
        var props = ['firstName', 'lastName', 'email', 'city', 'street', 'houseNumber', 'zipcode', 'description', 'location', 'directedBy'];
        props.forEach(function (key) {
            if (args.hasOwnProperty(key)) {
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
        // todo: figure out how to retrieve all equipmentItem attributes from args programmatically
        // atm it is transformed into a map so all keys are overwridden
        // options: not transform args into a map
        // give each new equipmentItem field its own unique name (like: equipmentItemName1)
        // temporary, need to figur out how to store a client
        // via its own repo? or via the job repo?
        sqliteClientRepo.save(client);
        var invoice = new invoice_1.Invoice(invoiceID, jobID, args['iban']);
        var invoiceService = new invoiceService_1.InvoiceService(sqliteInvoiceRepo, sqliteJobRepo, sqliteClientRepo);
        invoiceService.createInvoice(invoice, job);
    }
    catch (e) {
        console.log(e);
    }
});
//# sourceMappingURL=main.js.map