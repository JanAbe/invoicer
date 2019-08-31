"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
// moet rekeningnummer worden toegevoegd aan Client?
// is het zo dat de opdrachtgever van de klus ook 
// degene is aan wie de rekening verzonden moet worden.
var Client = /** @class */ (function () {
    function Client(fullName, email, address) {
        this._fullName = fullName;
        this._email = email;
        this._address = address;
    }
    Object.defineProperty(Client.prototype, "fullName", {
        get: function () {
            return this._fullName;
        },
        set: function (fullName) {
            if (util_1.isNullOrUndefined(fullName)) {
                throw new Error("Provided fullName is null or undefined");
            }
            this._fullName = fullName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Client.prototype, "email", {
        get: function () {
            return this._email;
        },
        set: function (email) {
            if (util_1.isNullOrUndefined(email)) {
                throw new Error("Provided email is null or undefined");
            }
            this._email = email;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Client.prototype, "address", {
        get: function () {
            return this._address;
        },
        set: function (address) {
            if (util_1.isNullOrUndefined(address)) {
                throw new Error("Provided address is null or undefined");
            }
            this._address = address;
        },
        enumerable: true,
        configurable: true
    });
    return Client;
}());
exports.Client = Client;
