import { isNullOrUndefined } from "util";
import moment from 'moment';

export class Period {
    private _startDate!: Date;
    private _endDate!: Date;

    constructor(startDate: Date, endDate: Date) {
        this.setStartDate(startDate);
        this.setEndDate(endDate);
    }

    // getDays return the number of days between
    // the startDate and the endDate
    public getDays(): number {
        // +1 because the work days are inclusive
        // working from 12/12/2019 till 12/12/2019 = 1 workday
        // eventhough there is no diff in days
        return moment.duration(moment(this.startDate).diff(moment(this.endDate))).asDays() + 1;
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