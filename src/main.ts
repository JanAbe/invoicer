import { app, BrowserWindow, ipcMain, webContents, WebContents, globalShortcut } from 'electron';
import { DB } from './db';
import { SqliteInvoiceRepo } from './repos/sqliteInvoiceRepo';
import { SqliteJobRepo } from './repos/sqliteJobRepo';
import { InvoiceID } from './domain/invoiceID';
import { Invoice } from './domain/invoice';
import { Job } from './domain/job';
import { JobID } from './domain/jobID';
import { Client } from './domain/client';
import { FullName } from './domain/fullName';
import { Email } from './domain/email';
import { Address } from './domain/address';
import { Cameraman } from './domain/cameraman';
import { Period } from './domain/period';
import { SqliteClientRepo } from './repos/sqliteClientRepo';
import { EquipmentItem } from './domain/equipmentItem';
import { InvoiceService } from './services/invoiceService';
import fs from 'fs';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: any;
let contents: any;
const dbLocation = `${__dirname}/../db/Invoice.db`;
const db = new DB(dbLocation);
db.createTables();

const sqliteJobRepo = new SqliteJobRepo(db);
const sqliteClientRepo = new SqliteClientRepo(db);
const sqliteInvoiceRepo = new SqliteInvoiceRepo(db, sqliteJobRepo);
const invoiceService = new InvoiceService(sqliteInvoiceRepo, sqliteJobRepo, sqliteClientRepo);

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,

        webPreferences: {
            nodeIntegration: true
        }

    });

    contents = mainWindow.webContents;
    // let contents = new WebContents();
    // contents.printToPDF({});

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/ui/home.html`);

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
app.on('ready', () => {
    // todo: improve this, create file with correct name and location
    globalShortcut.register('CommandOrControl+p', () => {
        console.log('printing..')
        contents.printToPDF({}, (err: any, data: any) => {
            if (err) {
                console.log(err);
            } else {
                fs.writeFile('/tmp/print.pdf', data, (error) => {
                    console.log('pdf written');
                });
            }
        });
    })
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
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
ipcMain.on('fetch-all-invoices-channel', (event, _) => {
    try {
        invoiceService.fetchAllInvoices()
            .then(html => {
                event.reply('fetch-all-invoices-reply-channel', html);
            })
            .catch(err => {
                console.log(err);
            })
    } catch (e) {
        console.log(e);
    }
});

// listen for fetched invoices
ipcMain.on('fetch-invoice-channel', (event, args) => {
    try {
        const invoiceKey = 'invoiceID';
        if (!args.hasOwnProperty(invoiceKey)) {
            event.reply('fetch-invoice-reply-channel', `${invoiceKey} key missing -> no invoiceID provided`);
        }

        const invoiceHTML = invoiceService.generatePDF(new InvoiceID(args[invoiceKey]));
        invoiceHTML
            .then(html => {
                event.reply('fetch-invoice-reply-channel', html);
            })
            .catch(err => {
                console.log(err);
            })
    } catch (e) {
        console.log(e);
    }
})

// listen for submitted invoices
// todo: add checks to see if cameraman and equipmentitem data has been passed
// also check if at least 1 of the 2 has been passed
ipcMain.on('submit-invoice-channel', (event, args) => {
    try {

        const props: string[] = ['firstName', 'lastName', 
                                 'email', 'city', 
                                 'street', 'houseNumber', 
                                 'zipcode', 'description', 
                                 'location', 'directedBy'];
        props.forEach((key) => {
            if (!args.hasOwnProperty(key)) {
                event.reply('submit-invoice-reply-channel', `${key} missing. All fields should be provided of a value.`);
            };
        });
        const jobID = sqliteJobRepo.nextID();
        const invoiceID = sqliteInvoiceRepo.nextID();
        const clientID = sqliteClientRepo.nextID();

        // if cameraman props are in args ->
        const cameraman = new Cameraman(args['cameramanFirstName'],
            args['cameramanLastName'],
            Number(args['cameramanDayPrice']),
            new Period(new Date(args['cameramanStartDate']),
                new Date(args['cameramanEndDate'])));
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

        // if equipmentItems is in args and it's not empty ->
        for (let item of args['equipmentItems']) {
            job.equipmentItems.push(new EquipmentItem(item['equipmentItemName'],
                item['equipmentItemDayPrice'],
                new Period(new Date(item['equipmentItemStartDate']), new Date(item['equipmentItemEndDate']))));
        }

        // temporary, need to figur out how to store a client
        // via its own repo? or via the job repo?
        sqliteClientRepo.save(client);
        const invoice = new Invoice(invoiceID, jobID, args['iban']);
        invoiceService.createInvoice(invoice, job);
    } catch (e) {
        console.log(e);
    }
});