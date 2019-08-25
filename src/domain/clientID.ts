import { isNullOrUndefined } from "util";

export class ClientID {
    private _id: string;

    constructor(id: string) {
        this._id = id;
    }

    public toString(): string {
        return this._id;
    }

    private setID(id: string): void {
        if (isNullOrUndefined(id)) {
            throw new Error("Provided id can not be null or undefined.");
        }

        this._id = id;
    }
}