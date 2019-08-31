"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var invoiceID_1 = require("../domain/invoiceID");
var invoice_1 = require("../domain/invoice");
var uuid = require("uuid/v4");
var jobID_1 = require("../domain/jobID");
var SqliteInvoiceRepo = /** @class */ (function () {
    function SqliteInvoiceRepo(db, jobRepo) {
        this._db = db;
        this._jobRepo = jobRepo;
    }
    SqliteInvoiceRepo.prototype.nextID = function () {
        return new invoiceID_1.InvoiceID(uuid());
    };
    SqliteInvoiceRepo.prototype.invoices = function () {
        return [];
    };
    SqliteInvoiceRepo.prototype.invoiceOfID = function (invoiceID) {
        var invoice;
        var query = 'SELECT id, creation_date, iban, ref_job FROM Invoice WHERE id=?';
        this._db.db.get(query, invoiceID.toString(), function (err, row) {
            if (err) {
                console.log(err);
                invoice = null;
            }
            else {
                invoice = new invoice_1.Invoice(new invoiceID_1.InvoiceID(row.id), new jobID_1.JobID(row.ref_job), row.iban, row.creation_date);
            }
        });
        return invoice;
    };
    SqliteInvoiceRepo.prototype.save = function (invoice) {
        // to save an invoice, the job of the invoice must also
        // be saved. Therefore the JobRepo is necessary
        throw new Error();
    };
    return SqliteInvoiceRepo;
}());
exports.SqliteInvoiceRepo = SqliteInvoiceRepo;
