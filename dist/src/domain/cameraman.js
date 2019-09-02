"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
// vgm is dit nu een soort value object
// het heeft wel een aparte tabel in de database denk ik
// maar het is onderdeel van Job
var Cameraman = /** @class */ (function () {
    function Cameraman(name, dayPrice, period) {
        this.setName(name);
        this.setDayPrice(dayPrice);
        this.setPeriod(period);
    }
    Cameraman.prototype.calculateCost = function () {
        // const daysWorked = this.period.getDays();
        // const cost = this.dayPrice * daysWorked;
        return -1;
    };
    Object.defineProperty(Cameraman.prototype, "name", {
        get: function () {
            return this._name;
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
    Cameraman.prototype.setName = function (name) {
        if (util_1.isNullOrUndefined(name)) {
            throw new Error("Provided name is null or undefined.");
        }
        this._name = name;
    };
    Cameraman.prototype.setDayPrice = function (dayPrice) {
        var MINIMUM_DAY_PRICE = 0;
        if (util_1.isNullOrUndefined(dayPrice)) {
            throw new Error("Provided dayPrice is null or undefined.");
        }
        if (dayPrice < MINIMUM_DAY_PRICE) {
            throw new Error("Provided dayPrice is lower than the minimum possible daily wage (0)");
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
