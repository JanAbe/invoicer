
export class EquipmentItemDTO {
    public name?: string;
    public dayPrice?: number;
    public startDate?: Date;
    public endDate?: Date;
    public daysRented?: number;
    public costs?: number;
    public id?: string;

    constructor(
        name?: string,
        dayPrice?: number,
        startDate?: Date,
        endDate?: Date,
        daysRented?: number,
        costs?: number,
        id?: string
    ) {
        this.name = name;
        this.dayPrice = dayPrice;
        this.startDate = startDate;
        this.endDate = endDate;
        this.daysRented = daysRented;
        this.costs = costs;
        this.id = id;
    }
}