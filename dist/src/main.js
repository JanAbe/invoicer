"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const db_1 = require("./db");
const sqliteInvoiceRepo_1 = require("./adapters/persistence/sqlite/sqliteInvoiceRepo");
const sqliteJobRepo_1 = require("./adapters/persistence/sqlite/sqliteJobRepo");
const sqliteClientRepo_1 = require("./adapters/persistence/sqlite/sqliteClientRepo");
const invoiceService_1 = require("./application/invoiceService");
const sqliteUserRepo_1 = require("./adapters/persistence/sqlite/sqliteUserRepo");
const invoiceChannelManager_1 = require("./adapters/ipc/invoiceChannelManager");
const userChannelManager_1 = require("./adapters/ipc/userChannelManager");
const userService_1 = require("./application/userService");
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
    electron_1.app.quit();
}
let mainWindow;
const createWindow = () => {
    mainWindow = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(`file://${__dirname}/ui/invoices.html`);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};
electron_1.app.on('ready', createWindow);
electron_1.app.on('ready', () => {
    mainWindow.webContents.once('did-finish-load', () => {
        mainWindow.reload();
    });
    const dbLocation = `${__dirname}/../db/Invoice.db`;
    const db = new db_1.DB(dbLocation);
    db.createTables();
    const sqliteUserRepo = new sqliteUserRepo_1.SqliteUserRepo(db);
    const sqliteJobRepo = new sqliteJobRepo_1.SqliteJobRepo(db);
    const sqliteClientRepo = new sqliteClientRepo_1.SqliteClientRepo(db);
    const sqliteInvoiceRepo = new sqliteInvoiceRepo_1.SqliteInvoiceRepo(db, sqliteJobRepo);
    const invoiceService = new invoiceService_1.InvoiceService(sqliteInvoiceRepo, sqliteJobRepo, sqliteClientRepo);
    const userService = new userService_1.UserService(sqliteUserRepo);
    const invoiceChanMan = new invoiceChannelManager_1.InvoiceChannelManager(electron_1.ipcMain, mainWindow, invoiceService, userService);
    const userChanMan = new userChannelManager_1.UserChannelManager(electron_1.ipcMain, userService);
    invoiceChanMan.initChannels();
    userChanMan.initChannels();
});
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
//# sourceMappingURL=main.js.map