"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
// vgm is dit nu een soort value object
// het heeft wel een aparte tabel in de database denk ik
// maar het is onderdeel van Job
var Cameraman = /** @class */ (function () {
    function Cameraman(firstName, lastName, dayPrice, period) {
        // this.setName(name);
        this.setFirstName(firstName);
        this.setLastName(lastName);
        this.setDayPrice(dayPrice);
        this.setPeriod(period);
    }
    Cameraman.prototype.calculateCost = function () {
        var daysWorked = this.period.getDays();
        var cost = this.dayPrice * daysWorked;
        return cost;
    };
    Object.defineProperty(Cameraman.prototype, "firstName", {
        // public get name(): string {
        //     return this._name;
        // }
        get: function () {
            return this._firstName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cameraman.prototype, "lastName", {
        get: function () {
            return this._lastName;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cameraman.prototype, "dayPrice", {
        get: function () {
            return this._dayPrice;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cameraman.prototype, "period", {
        get: function () {
            return this._period;
        },
        enumerable: true,
        configurable: true
    });
    // private setName(name: string): void {
    //     if (isNullOrUndefined(name)) {
    //         throw new Error("Provided name is null or undefined.");
    //     }
    //     this._name = name;
    // }
    Cameraman.prototype.setFirstName = function (firstName) {
        if (util_1.isNullOrUndefined(firstName)) {
            throw new Error("Provided firstname is null or undefined.");
        }
        this._firstName = firstName;
    };
    Cameraman.prototype.setLastName = function (lastName) {
        if (util_1.isNullOrUndefined(lastName)) {
            throw new Error("Provided lastname is null or undefined.");
        }
        this._lastName = lastName;
    };
    Cameraman.prototype.setDayPrice = function (dayPrice) {
        var MINIMUM_DAY_PRICE = 0;
        if (util_1.isNullOrUndefined(dayPrice)) {
            throw new Error("Provided dayPrice is null or undefined.");
        }
        if (dayPrice < MINIMUM_DAY_PRICE) {
            throw new Error("Provided dayPrice is lower than the minimum possible daily wage " + MINIMUM_DAY_PRICE);
        }
        this._dayPrice = dayPrice;
    };
    Cameraman.prototype.setPeriod = function (period) {
        if (util_1.isNullOrUndefined(period)) {
            throw new Error("Provided period is null or undefined.");
        }
        this._period = period;
    };
    return Cameraman;
}());
exports.Cameraman = Cameraman;
//# sourceMappingURL=cameraman.js.map