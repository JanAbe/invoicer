import { app, BrowserWindow, ipcMain } from 'electron';
import { DB } from './db';
import { SqliteInvoiceRepo } from './adapters/persistence/sqlite/sqliteInvoiceRepo';
import { SqliteJobRepo } from './adapters/persistence/sqlite/sqliteJobRepo';
import { SqliteClientRepo } from './adapters/persistence/sqlite/sqliteClientRepo';
import { InvoiceService } from './services/invoiceService';
import { SqliteUserRepo } from './adapters/persistence/sqlite/sqliteUserRepo';
import { InvoiceChannelManager } from './adapters/ipc/invoiceChannelManager';
import { UserChannelManager } from './adapters/ipc/userChannelManager';
import { UserService } from './services/userService';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: any;

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
app.on('ready', () => {
    const dbLocation = `${__dirname}/../db/Invoice.db`;
    const db = new DB(dbLocation);
    db.createTables();

    const sqliteUserRepo = new SqliteUserRepo(db);
    const sqliteJobRepo = new SqliteJobRepo(db);
    const sqliteClientRepo = new SqliteClientRepo(db);
    const sqliteInvoiceRepo = new SqliteInvoiceRepo(db, sqliteJobRepo);

    const invoiceService = new InvoiceService(sqliteInvoiceRepo, sqliteJobRepo, sqliteClientRepo, sqliteUserRepo);
    const userService = new UserService(sqliteUserRepo);

    const invoiceChanMan = new InvoiceChannelManager(ipcMain, mainWindow, invoiceService);
    const userChanMan = new UserChannelManager(ipcMain, userService);

    invoiceChanMan.initChannels();
    userChanMan.initChannels();
});

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