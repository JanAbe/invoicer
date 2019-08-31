"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var Address = /** @class */ (function () {
    function Address(city, street, houseNumber, zipcode) {
        this.setCity(city);
        this.setStreet(street);
        this.setHouseNumber(houseNumber);
        this.setZipcode(zipcode);
    }
    Object.defineProperty(Address.prototype, "city", {
        get: function () {
            return this._city;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Address.prototype, "street", {
        get: function () {
            return this._street;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Address.prototype, "houseNumber", {
        get: function () {
            return this._houseNumber;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Address.prototype, "zipcode", {
        get: function () {
            return this._zipcode;
        },
        enumerable: true,
        configurable: true
    });
    Address.prototype.setCity = function (city) {
        var MINIMUM_CITY_NAME_LENGTH = 1;
        if (util_1.isNullOrUndefined(city)) {
            throw new Error("Provided city is null or undefined");
        }
        if (city.length < MINIMUM_CITY_NAME_LENGTH) {
            throw new Error("Provided city can not have a length that is smaller than the minimum city name length (1)");
        }
        this._city = city;
    };
    Address.prototype.setStreet = function (street) {
        var MINIMUM_STREET_NAME_LENGTH = 1;
        if (util_1.isNullOrUndefined(street)) {
            throw new Error("Provided street is null or undefined");
        }
        if (street.length < MINIMUM_STREET_NAME_LENGTH) {
            throw new Error("Provided street can not have a length that is smaller than the minimum street name length (1)");
        }
        this._street = street;
    };
    Address.prototype.setHouseNumber = function (houseNumber) {
        var MINIMUM_HOUSE_NUMBER = 0;
        if (util_1.isNullOrUndefined(houseNumber)) {
            throw new Error("Provided houseNumber is null or undefined");
        }
        if (houseNumber < MINIMUM_HOUSE_NUMBER) {
            throw new Error("Provided houseNumber can not be smaller than the minimum house number (0)");
        }
        this._houseNumber = houseNumber;
    };
    Address.prototype.setZipcode = function (zipcode) {
        var DUTCH_ZIPCODE_LENGTH = 6;
        if (util_1.isNullOrUndefined(zipcode)) {
            throw new Error("Provided zipcode is null or undefined");
        }
        if (zipcode.length !== DUTCH_ZIPCODE_LENGTH) {
            throw new Error("Provided zipcode has a length that is different than the length of Dutch zipcodes.");
        }
        this._zipcode = zipcode;
    };
    return Address;
}());
exports.Address = Address;
