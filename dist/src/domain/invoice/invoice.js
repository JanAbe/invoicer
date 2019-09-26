"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class Invoice {
    // todo: create tests (for everything lol :c)
    // todo: add comment attribute
    // user can write some text in there
    // todo: add invoiceNumber attribute
    constructor(invoiceID, jobID, iban, creationDate = new Date()) {
        this._invoiceID = invoiceID;
        this._jobID = jobID;
        this._iban = iban;
        this._creationDate = creationDate;
    }
    // todo: implement this method
    generateInvoiceNumber() {
        // two ideas atm:
        // create static variable invoiceNumber
        // or create attribute invoiceNumber
        // than retrieve previously created invoice
        // based on creationDate. Use this one's invoiceNumber
        // to determine the invoiceNumber of the current invoice
        throw new Error();
    }
    get invoiceID() {
        return this._invoiceID;
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
    set invoiceID(invoiceID) {
        if (util_1.isNullOrUndefined(invoiceID)) {
            throw new Error("Provided invoiceID is null or undefined");
        }
        this._invoiceID = invoiceID;
    }
    // do i want to make it possible to change the jobID of an invoice?
    set jobID(jobID) {
        if (util_1.isNullOrUndefined(jobID)) {
            throw new Error("Provided jobID is null or undefined");
        }
        this._jobID = jobID;
    }
    set iban(iban) {
        if (util_1.isNullOrUndefined(iban)) {
            throw new Error("Provided iban is null or undefined");
        }
        // if (!IBAN.isValid(iban)) {
        //     throw new Error("Provided iban is invalid");
        // }
        this._iban = iban;
    }
}
exports.Invoice = Invoice;
//# sourceMappingURL=invoice.js.map