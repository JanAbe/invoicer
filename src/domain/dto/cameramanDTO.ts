
export class CameramanDTO {
    public firstName: string;
    public lastName: string;
    public dayPrice: number;
    public startDate: string;
    public endDate: string;
    public id?: string;

    constructor(
        firstName: string,
        lastName: string,
        dayPrice: number,
        startDate: string,
        endDate: string,
        id?: string
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dayPrice = dayPrice;
        this.startDate = startDate;
        this.endDate = endDate;
    }
}