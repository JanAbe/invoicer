import { isNullOrUndefined } from "util";

export class Period {
    private _startDate!: Date;
    private _endDate!: Date;

    constructor(startDate: Date, endDate: Date) {
        this.setStartDate(startDate);
        this.setEndDate(endDate);
    }
    
    public get startDate(): Date {
        return this._startDate;
    }
    
    
    public get endDate(): Date {
        return this._endDate;
    }

    private setStartDate(startDate: Date): void {
        if (isNullOrUndefined(startDate)) {
            throw new Error("Provided startDate is null or undefined");
        }

        this._startDate = startDate;
    }

    private setEndDate(endDate: Date): void {
        if (isNullOrUndefined(endDate)) {
            throw new Error("Provided endDate is null or undefined");
        }

        if (endDate < this.startDate) {
            throw new Error("Provided endDate occurred before the startDate")
        }

        this._endDate = endDate;
    }
}