import { isNullOrUndefined } from "util";

export class InvoiceID {
    private _id!: string;

    constructor(id: string) {
        this.setID(id);
    }

    public toString(): string {
        return this._id;
    }

    private setID(id: string): void {
        if (isNullOrUndefined(id)) {
            throw new Error("Provided id can not be null or undefined");
        }

        this._id = id;
    }
}