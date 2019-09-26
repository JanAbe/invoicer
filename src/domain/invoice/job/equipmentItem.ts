import { Rentable } from "./rentable";
import { Period } from "./period";
import { isNullOrUndefined } from "util";
import ezmoney = require('ezmoney');

// vgm is dit nu een soort value object
// het heeft wel een aparte tabel in de database denk ik
// maar het is onderdeel van Job
// Dit betekent dat er meerdere entries van een zelfde apparatuurItem kunnen zijn
// ik kan dus niet een select list geven met apparatuurItems waar uit gekozen kan worden
// wat ik wel kan doen is misschien alle unieke namen uit de tabel halen
// met dagprijs -> dit sturen naar de front-end. De front-end kan dit dan gebruiken
// om suggesties te geven aan de gebruiker tijdens het typen.
export class EquipmentItem implements Rentable {
    private _name!: string;
    private _dayPrice!: number;
    private _period!: Period;

    constructor(name: string, dayPrice: number, period: Period) {
        this.setName(name);
        this.setDayPrice(dayPrice);
        this.setPeriod(period);
    }

    public calculateCost(): number {
        const daysWorked = this.period.getDays();
        // return this.dayPrice * daysWorked;

        const dayPrice = ezmoney.fromNumber(this.dayPrice, 'EUR', 2);
        const cost = ezmoney.multiply(dayPrice, daysWorked, 0);
        return ezmoney.toNumber(cost);
    }

    public get name(): string {
        return this._name;
    }

    public get dayPrice(): number {
        return this._dayPrice;
    }

    public get period(): Period {
        return this._period;
    }

    private setName(name: string): void {
        if (isNullOrUndefined(name)) {
            throw new Error("Provided name is null or undefined.");
        }

        this._name = name;
    }

    private setDayPrice(dayPrice: number): void {
        const MINIMUM_DAY_PRICE = 0;

        if (isNullOrUndefined(dayPrice)) {
            throw new Error("Provided dayPrice is null or undefined.");
        }

        if (dayPrice < MINIMUM_DAY_PRICE) {
            throw new Error("Provided dayPrice is lower than the minimum possible daily wage (0)")
        }

        this._dayPrice = dayPrice;
    }

    private setPeriod(period: Period): void {
        if (isNullOrUndefined(period)) {
            throw new Error("Provided period is null or undefined.");
        }

        this._period = period;
    }
}