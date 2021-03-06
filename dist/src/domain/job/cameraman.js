"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const ezmoney = require("ezmoney");
const helpers_1 = require("../../util/helpers");
class Cameraman {
    constructor(firstName, lastName, dayPrice, period) {
        this.setFirstName(firstName);
        this.setLastName(lastName);
        this.setDayPrice(dayPrice);
        this.setPeriod(period);
    }
    calculateCost() {
        const daysWorked = this.period.getDays();
        const dayPrice = ezmoney.fromNumber(this.dayPrice, 'EUR', 2);
        const cost = ezmoney.multiply(dayPrice, daysWorked, 0, ezmoney.roundUp);
        return ezmoney.toNumber(cost);
    }
    get firstName() {
        return this._firstName;
    }
    get lastName() {
        return this._lastName;
    }
    get dayPrice() {
        return this._dayPrice;
    }
    get period() {
        return this._period;
    }
    setFirstName(firstName) {
        if (util_1.isNullOrUndefined(firstName)) {
            throw new Error("Provided firstname is null or undefined.");
        }
        if (helpers_1.isEmpty(firstName)) {
            throw new Error("Provided firstname is empty");
        }
        this._firstName = firstName;
    }
    setLastName(lastName) {
        if (util_1.isNullOrUndefined(lastName)) {
            throw new Error("Provided lastname is null or undefined.");
        }
        if (helpers_1.isEmpty(lastName)) {
            throw new Error("Provided lastname is empty");
        }
        this._lastName = lastName;
    }
    setDayPrice(dayPrice) {
        const MINIMUM_DAY_PRICE = 0;
        if (util_1.isNullOrUndefined(dayPrice)) {
            throw new Error("Provided dayPrice is null or undefined.");
        }
        if (dayPrice < MINIMUM_DAY_PRICE) {
            throw new Error(`Provided dayPrice is lower than the minimum possible daily wage ${MINIMUM_DAY_PRICE}`);
        }
        this._dayPrice = dayPrice;
    }
    setPeriod(period) {
        if (util_1.isNullOrUndefined(period)) {
            throw new Error("Provided period is null or undefined.");
        }
        this._period = period;
    }
}
exports.Cameraman = Cameraman;
//# sourceMappingURL=cameraman.js.map