"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var InvoiceID = /** @class */ (function () {
    function InvoiceID(id) {
        this._id = id;
    }
    InvoiceID.prototype.toString = function () {
        return this._id;
    };
    InvoiceID.prototype.setID = function (id) {
        if (util_1.isNullOrUndefined(id)) {
            throw new Error("Provided id can not be null or undefined");
        }
        this._id = id;
    };
    return InvoiceID;
}());
exports.InvoiceID = InvoiceID;
