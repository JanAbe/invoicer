import { Rentable } from "./rentable";
import { Period } from "./period";
import { FullName } from "./fullName";
import { isNullOrUndefined } from "util";

// vgm is dit nu een soort value object
// het heeft wel een aparte tabel in de database denk ik
// maar het is onderdeel van Job
export class Cameraman implements Rentable {
    private _fullName: FullName;
    private _dayPrice: number;
    private _period: Period;

    constructor(fullName: FullName, dayPrice: number, period: Period) {
        this.setFullName(fullName);
        this.setDayPrice(dayPrice);
        this.setPeriod(period);
    }

    public calculateCost(): number {
        // const daysWorked = this.period.getDays();
        // const cost = this.dayPrice * daysWorked;
        return -1;
    }

    public get fullName(): FullName {
        return this._fullName;
    }

    public get dayPrice(): number {
        return this._dayPrice;
    }

    public get period(): Period {
        return this._period;
    }
    
    private setFullName(fullName: FullName): void {
        if (isNullOrUndefined(fullName)) {
            throw new Error("Provided fullName is null or undefined.");
        }

        this._fullName = fullName;
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