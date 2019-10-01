"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const ezmoney = require("ezmoney");
const helpers_1 = require("../../util/helpers");
// vgm is dit nu een soort value object
// het heeft wel een aparte tabel in de database denk ik
// maar het is onderdeel van Job
// Dit betekent dat er meerdere entries van een zelfde apparatuurItem kunnen zijn
// ik kan dus niet een select list geven met apparatuurItems waar uit gekozen kan worden
// wat ik wel kan doen is misschien alle unieke namen uit de tabel halen
// met dagprijs -> dit sturen naar de front-end. De front-end kan dit dan gebruiken
// om suggesties te geven aan de gebruiker tijdens het typen.
class EquipmentItem {
    constructor(name, dayPrice, period) {
        this.setName(name);
        this.setDayPrice(dayPrice);
        this.setPeriod(period);
    }
    calculateCost() {
        const daysWorked = this.period.getDays();
        const dayPrice = ezmoney.fromNumber(this.dayPrice, 'EUR', 2);
        const cost = ezmoney.multiply(dayPrice, daysWorked, 0, ezmoney.roundUp);
        return ezmoney.toNumber(cost);
    }
    get name() {
        return this._name;
    }
    get dayPrice() {
        return this._dayPrice;
    }
    get period() {
        return this._period;
    }
    setName(name) {
        if (util_1.isNullOrUndefined(name)) {
            throw new Error("Provided name is null or undefined.");
        }
        if (helpers_1.isEmpty(name)) {
            throw new Error("Provided name is empty");
        }
        this._name = name;
    }
    setDayPrice(dayPrice) {
        const MINIMUM_DAY_PRICE = 0;
        if (util_1.isNullOrUndefined(dayPrice)) {
            throw new Error("Provided dayPrice is null or undefined.");
        }
        if (dayPrice < MINIMUM_DAY_PRICE) {
            throw new Error(`Provided dayPrice is lower than the minimum possible daily wage (${MINIMUM_DAY_PRICE})`);
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
exports.EquipmentItem = EquipmentItem;
//# sourceMappingURL=equipmentItem.js.map