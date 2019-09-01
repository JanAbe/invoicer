import { app, BrowserWindow } from 'electron';
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

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: any;

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
    });

    // and load the index.html of the app.
    mainWindow.loadURL(`file://${__dirname}/ui/index.html`);

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });

    // Extract this into its own method?
    // When / which electron event should be used to call this code
    const dbLocation = `${__dirname}/../db/Invoice.db`;
    console.log(dbLocation);
    const db = new DB(dbLocation);
    db.createTables();

    // doesn't work yet :c
    const sqliteJobRepo = new SqliteJobRepo(db);
    const job = new Job(new JobID('971a63e3-2654-4954-b523-05747e1a73f5'), 'test job', 'amsterdam', 'directie', 
                        new Client(new FullName('tom', 'hengst'), new Email('test@email.com'), new Address('amsterdam', 'streetname', 12, '1234QQ')), 
                        undefined, 
                        undefined);
    const rowID = sqliteJobRepo.save(job);
    rowID.then(value => console.log(value)).catch(err => console.log(err));
    const sqliteInvoiceRepo = new SqliteInvoiceRepo(db, sqliteJobRepo);
    const invoice = sqliteInvoiceRepo.invoiceOfID(new InvoiceID("6ccc310d-4734-4c36-8390-525be0739ed7"));
    invoice.then(value => console.log(value)).catch(err => console.log(err));
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
