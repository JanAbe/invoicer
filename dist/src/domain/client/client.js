"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class Client {
    constructor(id, fullName, email, address) {
        this._id = id;
        this._fullName = fullName;
        this._email = email;
        this._address = address;
    }
    get id() {
        return this._id;
    }
    get fullName() {
        return this._fullName;
    }
    get email() {
        return this._email;
    }
    get address() {
        return this._address;
    }
    set id(id) {
        if (util_1.isNullOrUndefined(id)) {
            throw new Error("Provided id is null or undefined");
        }
        this._id = id;
    }
    set fullName(fullName) {
        if (util_1.isNullOrUndefined(fullName)) {
            throw new Error("Provided fullName is null or undefined");
        }
        this._fullName = fullName;
    }
    set email(email) {
        if (util_1.isNullOrUndefined(email)) {
            throw new Error("Provided email is null or undefined");
        }
        this._email = email;
    }
    set address(address) {
        if (util_1.isNullOrUndefined(address)) {
            throw new Error("Provided address is null or undefined");
        }
        this._address = address;
    }
}
exports.Client = Client;
//# sourceMappingURL=client.js.map