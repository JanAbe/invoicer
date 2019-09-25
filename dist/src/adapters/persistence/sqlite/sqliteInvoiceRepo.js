"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const invoiceID_1 = require("../../../domain/invoiceID");
const invoice_1 = require("../../../domain/invoice");
const jobID_1 = require("../../../domain/jobID");
const uuid = require("uuid/v4");
const moment_1 = __importDefault(require("moment"));
class SqliteInvoiceRepo {
    constructor(db, jobRepo) {
        this._db = db;
        this._jobRepo = jobRepo;
    }
    nextID() {
        return new invoiceID_1.InvoiceID(uuid());
    }
    invoices() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT id from Invoice;';
            let invoices = [];
            let invoicdeIDs = [];
            const rows = yield this._db.all(query);
            rows.forEach(row => {
                invoicdeIDs.push(new invoiceID_1.InvoiceID(row.id));
            });
            for (let id of invoicdeIDs) {
                const invoice = yield this.invoiceOfID(id);
                invoices.push(invoice);
            }
            return new Promise((resolve, reject) => {
                resolve(invoices);
            });
        });
    }
    invoiceOfID(invoiceID) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT id, creation_date, iban, ref_job FROM Invoice WHERE id=?';
            // how does this work?
            // how is this a promise? it was suggested by vscode to change it into this
            const row = yield this._db.get(query, [invoiceID.toString()]);
            return new invoice_1.Invoice(new invoiceID_1.InvoiceID(row.id), new jobID_1.JobID(row.ref_job), row.iban, moment_1.default(row.creation_date, 'DD/MM/YYYY').toDate());
        });
    }
    save(invoice, job) {
        this._jobRepo.save(job);
        const invoiceQuery = 'INSERT INTO Invoice (id, iban, creation_date, ref_job) VALUES (?, ?, ?, ?);';
        this._db.run(invoiceQuery, [
            invoice.invoiceID.toString(),
            invoice.iban,
            invoice.creationDate.toLocaleDateString('nl'),
            invoice.jobID.toString()
        ]);
    }
}
exports.SqliteInvoiceRepo = SqliteInvoiceRepo;
//# sourceMappingURL=sqliteInvoiceRepo.js.map