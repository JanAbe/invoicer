"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const helpers_1 = require("../../util/helpers");
class Address {
    constructor(city, street, houseNumber, zipcode) {
        this.setCity(city);
        this.setStreet(street);
        this.setHouseNumber(houseNumber);
        this.setZipcode(zipcode);
    }
    get city() {
        return this._city;
    }
    get street() {
        return this._street;
    }
    get houseNumber() {
        return this._houseNumber;
    }
    get zipcode() {
        return this._zipcode;
    }
    setCity(city) {
        if (util_1.isNullOrUndefined(city)) {
            throw new Error("Provided city is null or undefined");
        }
        if (helpers_1.isEmpty(city)) {
            throw new Error("Provided city can not be empty");
        }
        this._city = city;
    }
    setStreet(street) {
        if (util_1.isNullOrUndefined(street)) {
            throw new Error("Provided street is null or undefined");
        }
        if (helpers_1.isEmpty(street)) {
            throw new Error("Provided street can not be empty");
        }
        this._street = street;
    }
    setHouseNumber(houseNumber) {
        const MINIMUM_HOUSE_NUMBER = 0;
        if (util_1.isNullOrUndefined(houseNumber)) {
            throw new Error("Provided houseNumber is null or undefined");
        }
        if (houseNumber < MINIMUM_HOUSE_NUMBER) {
            throw new Error("Provided houseNumber can not be smaller than the minimum house number (0)");
        }
        this._houseNumber = houseNumber;
    }
    setZipcode(zipcode) {
        const validationRegex = /^\d{4}\s*[a-zA-z]{2}$/;
        if (util_1.isNullOrUndefined(zipcode)) {
            throw new Error("Provided zipcode is null or undefined");
        }
        if (!validationRegex.test(zipcode)) {
            throw new Error("Provided zipcode is invalid.");
        }
        // remove all whitespaces
        zipcode = zipcode.replace(/\s/g, '');
        zipcode = zipcode.toUpperCase();
        this._zipcode = zipcode;
    }
}
exports.Address = Address;
//# sourceMappingURL=address.js.map