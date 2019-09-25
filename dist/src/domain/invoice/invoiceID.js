"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class InvoiceID {
    constructor(id) {
        this._id = id;
    }
    toString() {
        return this._id;
    }
    setID(id) {
        if (util_1.isNullOrUndefined(id)) {
            throw new Error("Provided id can not be null or undefined");
        }
        this._id = id;
    }
}
exports.InvoiceID = InvoiceID;
//# sourceMappingURL=invoiceID.js.map