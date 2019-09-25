"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class FullName {
    constructor(firstName, lastName) {
        this.setFirstName(firstName);
        this.setLastName(lastName);
    }
    get firstName() {
        return this._firstName;
    }
    get lastName() {
        return this._lastName;
    }
    setFirstName(firstName) {
        if (util_1.isNullOrUndefined(firstName)) {
            throw new Error("Provided firstname is null or undefined.");
        }
        this._firstName = firstName.trim();
    }
    setLastName(lastName) {
        if (util_1.isNullOrUndefined(lastName)) {
            throw new Error("Provided lastname is null or undefined.");
        }
        this._lastName = lastName.trim();
    }
    toString() {
        return [this.firstName, this.lastName].join(' ');
    }
}
exports.FullName = FullName;
//# sourceMappingURL=fullName.js.map