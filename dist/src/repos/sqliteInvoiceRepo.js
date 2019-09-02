"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var invoiceID_1 = require("../domain/invoiceID");
var uuid = require("uuid/v4");
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
        var query = 'SELECT id, creation_date, iban, ref_job FROM Invoice WHERE id=?';
        // how is this automatically converted to an Invoice object?
        return this._db.get(query, [invoiceID.toString()]);
    };
    SqliteInvoiceRepo.prototype.save = function (invoice) {
        // to save an invoice, the job of the invoice must also
        // be saved. Therefore the JobRepo is necessary
        throw new Error();
    };
    return SqliteInvoiceRepo;
}());
exports.SqliteInvoiceRepo = SqliteInvoiceRepo;
