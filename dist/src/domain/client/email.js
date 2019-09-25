"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class Email {
    constructor(emailAddress) {
        this.setEmailAddress(emailAddress);
    }
    get emailAddress() {
        return this._emailAddress;
    }
    setEmailAddress(emailAddress) {
        if (util_1.isNullOrUndefined(emailAddress)) {
            throw new Error("Provided emailAddress is null or undefined.");
        }
        if (!this.isValid(emailAddress)) {
            throw new Error("Provided emailAddress is invalid.");
        }
        this._emailAddress = emailAddress;
    }
    // TODO: add more checks
    // isValid checks if the provided emailAddress is valid 
    isValid(emailAddress) {
        if (emailAddress.includes("@")) {
            return true;
        }
        return false;
    }
}
exports.Email = Email;
//# sourceMappingURL=email.js.map