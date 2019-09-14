"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var FullName = /** @class */ (function () {
    function FullName(firstName, lastName) {
        this.setFirstName(firstName);
        this.setLastName(lastName);
    }
    Object.defineProperty(FullName.prototype, "firstName", {
        get: function () {
            return this._firstName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FullName.prototype, "lastName", {
        get: function () {
            return this._lastName;
        },
        enumerable: true,
        configurable: true
    });
    FullName.prototype.setFirstName = function (firstName) {
        if (util_1.isNullOrUndefined(firstName)) {
            throw new Error("Provided firstname is null or undefined.");
        }
        this._firstName = firstName.trim();
    };
    FullName.prototype.setLastName = function (lastName) {
        if (util_1.isNullOrUndefined(lastName)) {
            throw new Error("Provided lastname is null or undefined.");
        }
        this._lastName = lastName.trim();
    };
    FullName.prototype.toString = function () {
        return [this.firstName, this.lastName].join(' ');
    };
    return FullName;
}());
exports.FullName = FullName;
//# sourceMappingURL=fullName.js.map