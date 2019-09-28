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
        const validationRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (util_1.isNullOrUndefined(emailAddress)) {
            throw new Error("Provided emailAddress is null or undefined.");
        }
        if (!validationRegex.test(emailAddress)) {
            throw new Error("Provided emailaddress is invalid");
        }
        this._emailAddress = emailAddress;
    }
}
exports.Email = Email;
//# sourceMappingURL=email.js.map