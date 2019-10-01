import { Rentable } from "./rentable";
import { Period } from "./period";
import { isNullOrUndefined } from "util";
import ezmoney = require('ezmoney');
import { isEmpty } from "../../util/helpers";

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
        const dayPrice = ezmoney.fromNumber(this.dayPrice, 'EUR', 2);
        const cost = ezmoney.multiply(dayPrice, daysWorked, 0, ezmoney.roundUp);
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

        if (isEmpty(name)) {
            throw new Error("Provided name is empty");
        }

        this._name = name;
    }

    private setDayPrice(dayPrice: number): void {
        const MINIMUM_DAY_PRICE = 0;

        if (isNullOrUndefined(dayPrice)) {
            throw new Error("Provided dayPrice is null or undefined.");
        }

        if (dayPrice < MINIMUM_DAY_PRICE) {
            throw new Error(`Provided dayPrice is lower than the minimum possible daily wage (${MINIMUM_DAY_PRICE})`);
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