"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const moment_1 = __importDefault(require("moment"));
class Period {
    constructor(startDate, endDate) {
        this.setStartDate(startDate);
        this.setEndDate(endDate);
    }
    /** getDays return the number of days between
    the startDate and the endDate */
    getDays() {
        // +1 because the work days are inclusive
        // working from 12/12/2019 till 12/12/2019 = 1 workday
        // eventhough there is no diff in days
        const endDate = moment_1.default(this.endDate);
        const startDate = moment_1.default(this.startDate);
        const daysInBetween = moment_1.default.duration(endDate.diff(startDate)).asDays() + 1;
        return daysInBetween;
    }
    get startDate() {
        return this._startDate;
    }
    get endDate() {
        return this._endDate;
    }
    setStartDate(startDate) {
        if (util_1.isNullOrUndefined(startDate)) {
            throw new Error("Provided startDate is null or undefined");
        }
        this._startDate = startDate;
    }
    setEndDate(endDate) {
        if (util_1.isNullOrUndefined(endDate)) {
            throw new Error("Provided endDate is null or undefined");
        }
        if (endDate < this.startDate) {
            throw new Error("Provided endDate occurred before the startDate");
        }
        this._endDate = endDate;
    }
}
exports.Period = Period;
//# sourceMappingURL=period.js.map