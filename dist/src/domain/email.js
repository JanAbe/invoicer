"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var Email = /** @class */ (function () {
    function Email(emailAddress) {
        this.setEmailAddress(emailAddress);
    }
    Object.defineProperty(Email.prototype, "emailAddress", {
        get: function () {
            return this._emailAddress;
        },
        enumerable: true,
        configurable: true
    });
    Email.prototype.setEmailAddress = function (emailAddress) {
        if (util_1.isNullOrUndefined(emailAddress)) {
            throw new Error("Provided emailAddress is null or undefined.");
        }
        if (!this.isValid(emailAddress)) {
            throw new Error("Provided emailAddress is invalid.");
        }
        this._emailAddress = emailAddress;
    };
    // TODO: add more checks
    // isValid checks if the provided emailAddress is valid 
    Email.prototype.isValid = function (emailAddress) {
        if (emailAddress.includes("@")) {
            return true;
        }
        return false;
    };
    return Email;
}());
exports.Email = Email;
