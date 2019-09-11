"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var moment_1 = __importDefault(require("moment"));
var Period = /** @class */ (function () {
    function Period(startDate, endDate) {
        this.setStartDate(startDate);
        this.setEndDate(endDate);
    }
    // getDays return the number of days between
    // the startDate and the endDate
    Period.prototype.getDays = function () {
        // +1 because the work days are inclusive
        // working from 12/12/2019 till 12/12/2019 = 1 workday
        // eventhough there is no diff in days
        var endDate = moment_1.default(this.endDate);
        var startDate = moment_1.default(this.startDate);
        var daysWorked = moment_1.default.duration(endDate.diff(startDate)).asDays() + 1;
        return daysWorked;
    };
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