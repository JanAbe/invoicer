
export class EquipmentItemDTO {
    public name: string;
    public dayPrice: number;
    public startDate: string;
    public endDate: string;
    public id?: string;

    constructor(
        name: string,
        dayPrice: number,
        startDate: string,
        endDate: string,
        id?: string
    ) {
        this.name = name;
        this.dayPrice = dayPrice;
        this.startDate = startDate;
        this.endDate = endDate;
        this.id = id;
    }
}