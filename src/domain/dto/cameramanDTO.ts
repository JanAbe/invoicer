
export class CameramanDTO {
    public firstName?: string;
    public lastName?: string;
    public dayPrice?: number;
    public startDate?: Date;
    public endDate?: Date;
    public daysWorked?: number;
    public costs?: number;
    public id?: string;

    constructor(
        firstName?: string,
        lastName?: string,
        dayPrice?: number,
        startDate?: Date,
        endDate?: Date,
        daysWorked?: number,
        costs?: number,
        id?: string
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dayPrice = dayPrice;
        this.startDate = startDate;
        this.endDate = endDate;
        this.daysWorked = daysWorked;
        this.costs = costs;
    }
}