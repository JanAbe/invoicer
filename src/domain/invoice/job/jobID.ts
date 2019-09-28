import { isNullOrUndefined } from "util";

export class JobID {
    private _id!: string;

    constructor(id: string) {
        // needs check to see if incoming string is a UUID4
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