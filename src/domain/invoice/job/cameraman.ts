import { Rentable } from "./rentable";
import { Period } from "./period";
import { isNullOrUndefined } from "util";
import ezmoney = require('ezmoney');

// vgm is dit nu een soort value object
// het heeft wel een aparte tabel in de database denk ik
// maar het is onderdeel van Job
export class Cameraman implements Rentable {
    private _firstName!: string;
    private _lastName!: string;
    private _dayPrice!: number;
    private _period!: Period;

    constructor(firstName: string, lastName: string, dayPrice: number, period: Period) {
        this.setFirstName(firstName);
        this.setLastName(lastName);
        this.setDayPrice(dayPrice);
        this.setPeriod(period);
    }

    public calculateCost(): number {
        const daysWorked = this.period.getDays();
        // const cost = this.dayPrice * daysWorked;

        const dayPrice = ezmoney.fromNumber(this.dayPrice, 'EUR', 2);
        const cost = ezmoney.multiply(dayPrice, daysWorked, 0);
        return ezmoney.toNumber(cost);
    }

    public get firstName(): string {
        return this._firstName;
    }

    public get lastName(): string {
        return this._lastName;
    }

    public get dayPrice(): number {
        return this._dayPrice;
    }

    public get period(): Period {
        return this._period;
    }
    
    private setFirstName(firstName: string): void {
        if (isNullOrUndefined(firstName)) {
            throw new Error("Provided firstname is null or undefined.");
        }

        this._firstName = firstName;
    }

    private setLastName(lastName: string): void {
        if (isNullOrUndefined(lastName)) {
            throw new Error("Provided lastname is null or undefined.");
        }

        this._lastName = lastName;
    }
    
    private setDayPrice(dayPrice: number): void {
        const MINIMUM_DAY_PRICE = 0;

        if (isNullOrUndefined(dayPrice)) {
            throw new Error("Provided dayPrice is null or undefined.");
        }

        if (dayPrice < MINIMUM_DAY_PRICE) {
            throw new Error(`Provided dayPrice is lower than the minimum possible daily wage ${MINIMUM_DAY_PRICE}`)
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