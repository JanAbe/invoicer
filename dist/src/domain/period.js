"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var Period = /** @class */ (function () {
    function Period(startDate, endDate) {
        this.setStartDate(startDate);
        this.setEndDate(endDate);
    }
    Object.defineProperty(Period.prototype, "startDate", {
        get: function () {
            return this._startDate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Period.prototype, "endDate", {
        get: function () {
            return this._endDate;
        },
        enumerable: true,
        configurable: true
    });
    Period.prototype.setStartDate = function (startDate) {
        if (util_1.isNullOrUndefined(startDate)) {
            throw new Error("Provided startDate is null or undefined");
        }
        this._startDate = startDate;
    };
    Period.prototype.setEndDate = function (endDate) {
        if (util_1.isNullOrUndefined(endDate)) {
            throw new Error("Provided endDate is null or undefined");
        }
        if (endDate < this.startDate) {
            throw new Error("Provided endDate occurred before the startDate");
        }
        this._endDate = endDate;
    };
    return Period;
}());
exports.Period = Period;
//# sourceMappingURL=period.js.map