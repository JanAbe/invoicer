"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const IBAN = require("iban");
class Invoice {
    constructor(invoiceID, invoiceNumber, jobID, iban, creationDate = new Date()) {
        this.setInvoiceID(invoiceID);
        this.setInvoiceNumber(invoiceNumber);
        this.setJobID(jobID);
        this.setIban(iban);
        this._creationDate = creationDate;
    }
    /**
     * Generates a new invoice number based on the amount of already present
     * invoices of this year, the creation date
     * @param nrOfInvoices the nr of invoices that are already made this year
     * @param creationDate the date this invoice is being made
     */
    // todo: rewrite so it isn't the slowest thing ever
    static generateInvoiceNumber(nrOfInvoices, creationDate) {
        const maxSize = 5; // max 99_999 invoiceNumbers can be made === enough room for growth
        if (nrOfInvoices === 99999) {
            throw new Error("Max nr of invoices already reached. Aborting.");
        }
        nrOfInvoices++;
        let nextInvoiceNumber = nrOfInvoices.toString();
        while (nextInvoiceNumber.length !== maxSize) {
            nextInvoiceNumber = `0${nextInvoiceNumber}`;
        }
        nextInvoiceNumber = `${creationDate.getFullYear()}${nextInvoiceNumber}`;
        return nextInvoiceNumber;
    }
    get invoiceID() {
        return this._invoiceID;
    }
    get invoiceNumber() {
        return this._invoiceNumber;
    }
    get jobID() {
        return this._jobID;
    }
    get iban() {
        return this._iban;
    }
    get creationDate() {
        return this._creationDate;
    }
    setInvoiceID(invoiceID) {
        if (util_1.isNullOrUndefined(invoiceID)) {
            throw new Error("Provided invoiceID is null or undefined");
        }
        this._invoiceID = invoiceID;
    }
    setInvoiceNumber(invoiceNumber) {
        if (util_1.isNullOrUndefined(invoiceNumber)) {
            throw new Error("Provided invoiceNumber is null or undefined");
        }
        this._invoiceNumber = invoiceNumber;
    }
    setJobID(jobID) {
        if (util_1.isNullOrUndefined(jobID)) {
            throw new Error("Provided jobID is null or undefined");
        }
        this._jobID = jobID;
    }
    setIban(iban) {
        if (util_1.isNullOrUndefined(iban)) {
            throw new Error("Provided iban is null or undefined");
        }
        if (!IBAN.isValid(iban)) {
            throw new Error("Provided iban is invalid");
        }
        this._iban = iban;
    }
}
exports.Invoice = Invoice;
//# sourceMappingURL=invoice.js.map