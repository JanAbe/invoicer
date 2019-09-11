import { app, BrowserWindow, ipcMain } from 'electron';
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
const sqliteJobRepo = new SqliteJobRepo(db);
const sqliteClientRepo = new SqliteClientRepo(db);
const sqliteInvoiceRepo = new SqliteInvoiceRepo(db, sqliteJobRepo);

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      frame: false,

      webPreferences: {
        nodeIntegration: true
      }

    });

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

    const jobID = new JobID('8c2853c2-f2d7-44e1-bab8-2e934ed5e276');
    const job = sqliteJobRepo.jobOfID(jobID);
    job.then((val) => {
        // console.log(val)
    }).catch((err) => console.log(err));
        
    
    const invoiceService = new InvoiceService(sqliteInvoiceRepo, sqliteJobRepo, sqliteClientRepo);
    const x = invoiceService.generatePDF(new InvoiceID('acbef742-7cec-48ec-aa05-129d2ca0b44c'));
    x.catch(err => {
      console.log(err);
    })
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
app.on('ready', createWindow);

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


// listen for submitted invoices
ipcMain.on('submit-invoice-channel', (event, args) => {
    try {

        const props: string[] = ['firstName', 'lastName', 'email', 'city', 'street', 'houseNumber', 'zipcode', 'description', 'location', 'directedBy'];
        props.forEach((key) => {
            if (args.hasOwnProperty(key)) {
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
        // todo: figure out how to retrieve all equipmentItem attributes from args programmatically
        // atm it is transformed into a map so all keys are overwridden
        // options: not transform args into a map
        // give each new equipmentItem field its own unique name (like: equipmentItemName1)

        // temporary, need to figur out how to store a client
        // via its own repo? or via the job repo?
        sqliteClientRepo.save(client);
        const invoice = new Invoice(invoiceID, jobID, args['iban']);
        const invoiceService = new InvoiceService(sqliteInvoiceRepo, sqliteJobRepo, sqliteClientRepo);
        invoiceService.createInvoice(invoice, job);
    } catch (e) {
        console.log(e);
    }
});