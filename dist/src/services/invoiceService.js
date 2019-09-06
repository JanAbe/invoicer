"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// InvoiceService contains all services a user can call regarding invoices
var InvoiceService = /** @class */ (function () {
    function InvoiceService(invoiceRepo) {
        this._invoiceRepo = invoiceRepo;
    }
    InvoiceService.prototype.createInvoice = function (invoice, job) {
        // creates an invoice and stores it in the database
        this._invoiceRepo.save(invoice, job);
        throw new Error("Not implemented yet");
    };
    InvoiceService.prototype.fetchInvoiceByID = function (invoiceID) {
        this._invoiceRepo.invoiceOfID(invoiceID);
        throw new Error("Not implemented yet");
    };
    InvoiceService.prototype.fetchAllInvoices = function () {
        this._invoiceRepo.invoices();
        throw new Error("Not implemented yet");
    };
    InvoiceService.prototype.generatePDF = function (invoiceID) {
        /*
        fetch invoice with id=invoiceID from database
        create a pdf with all the necessary information
            (gotten from the fetched invoice)
        store the pdf in the location chosen by the user
            (e.g. /home/user/Documents/invoices/)
        */
        throw new Error("Not implemented yet");
    };
    return InvoiceService;
}());
exports.InvoiceService = InvoiceService;
//# sourceMappingURL=invoiceService.js.map