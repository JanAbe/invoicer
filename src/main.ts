import { app, BrowserWindow, ipcMain } from 'electron';
import { DB } from './db';
import { SqliteInvoiceRepo } from './repos/sqlite/sqliteInvoiceRepo';
import { SqliteJobRepo } from './repos/sqlite/sqliteJobRepo';
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
import { SqliteClientRepo } from './repos/sqlite/sqliteClientRepo';
import { EquipmentItem } from './domain/equipmentItem';
import { InvoiceService } from './services/invoiceService';
import { UserDTO } from './domain/dto/userDTO';
import { SqliteUserRepo } from './repos/sqlite/sqliteUserRepo';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: any;
const dbLocation = `${__dirname}/../db/Invoice.db`;
const db = new DB(dbLocation);
db.createTables();

const sqliteUserRepo = new SqliteUserRepo(db);
const sqliteJobRepo = new SqliteJobRepo(db);
const sqliteClientRepo = new SqliteClientRepo(db);
const sqliteInvoiceRepo = new SqliteInvoiceRepo(db, sqliteJobRepo);
const invoiceService = new InvoiceService(sqliteInvoiceRepo, sqliteJobRepo, sqliteClientRepo, sqliteUserRepo);

const createWindow = () => {
    mainWindow = new BrowserWindow({
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

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
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
ipcMain.on('generate-invoice-channel', (event, args) => {
    try {
        const invoiceKey = 'invoiceID';
        const userKey = 'userID';
        const invoiceHTML = invoiceService.generateInvoice(new InvoiceID(args[invoiceKey]), args[userKey]);

        invoiceHTML
            .then(html => {
                mainWindow.loadURL(`file://${__dirname}/ui/invoice.html`);
                mainWindow.webContents.on('did-finish-load', () => {
                    event.reply('generate-invoice-reply-channel', html);
                });
            })
            .catch(err => {
                console.log(err);
            })
    } catch (e) {
        console.log(e);
    }
})

// todo: add user table to db containing all general info data
    // like iban, name, etc.
ipcMain.on('submit-user-channel', async (event, user) => {
    try {
        const userDTO = new UserDTO(
            user['id'],
            user['firstName'],
            user['lastName'],
            user['iban'],
            user['companyName'],
            user['jobTitle'],
            user['bankAccountNr'],
            user['phoneNr'],
            user['mobileNr'],
            user['email'],
            user['coc'],
            user['vatNr'],
            user['varNr'],
            user['city'],
            user['zipcode'],
            user['street'],
            user['houseNr']
        );
        const id = await sqliteUserRepo.saveOrdUpdate(userDTO);
        if (id !== "") {
            event.reply('submit-user-reply-channel', id);
        }
    } catch (e) {
        console.log(e);
    }
});

// listen for submitted invoices
// todo: add checks to see if cameraman and equipmentitem data has been passed
// also check if at least 1 of the 2 has been passed
ipcMain.on('submit-invoice-channel', (event, args) => {
    try {
        const requiredKeys: string[] = ['firstName', 'lastName', 
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
        invoiceService.createInvoice(invoice, job);
    } catch (e) {
        console.log(e);
    }
});