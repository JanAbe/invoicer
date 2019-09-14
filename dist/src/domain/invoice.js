"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var Invoice = /** @class */ (function () {
    function Invoice(invoiceID, jobID, iban, creationDate) {
        if (creationDate === void 0) { creationDate = new Date(); }
        this._invoiceID = invoiceID;
        this._jobID = jobID;
        this._iban = iban;
        this._creationDate = creationDate;
    }
    Invoice.prototype.generateInvoiceNumber = function () {
        throw new Error();
    };
    Object.defineProperty(Invoice.prototype, "invoiceID", {
        get: function () {
            return this._invoiceID;
        },
        set: function (invoiceID) {
            if (util_1.isNullOrUndefined(invoiceID)) {
                throw new Error("Provided invoiceID is null or undefined");
            }
            this._invoiceID = invoiceID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Invoice.prototype, "jobID", {
        get: function () {
            return this._jobID;
        },
        // do i want to make it possible to change the jobID of an invoice?
        set: function (jobID) {
            if (util_1.isNullOrUndefined(jobID)) {
                throw new Error("Provided jobID is null or undefined");
            }
            this._jobID = jobID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Invoice.prototype, "iban", {
        get: function () {
            return this._iban;
        },
        set: function (iban) {
            if (util_1.isNullOrUndefined(iban)) {
                throw new Error("Provided iban is null or undefined");
            }
            // if (!IBAN.isValid(iban)) {
            //     throw new Error("Provided iban is invalid");
            // }
            this._iban = iban;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Invoice.prototype, "creationDate", {
        get: function () {
            return this._creationDate;
        },
        enumerable: true,
        configurable: true
    });
    return Invoice;
}());
exports.Invoice = Invoice;
//# sourceMappingURL=invoice.js.map