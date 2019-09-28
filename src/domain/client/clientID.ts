import { isNullOrUndefined } from "util";

export class ClientID {
    private _id!: string;

    constructor(id: string) {
        this.setID(id);
    }

    public toString(): string {
        return this._id;
    }

    private setID(id: string): void {
        // todo: needs check to see if incoming string is a UUID4
        if (isNullOrUndefined(id)) {
            throw new Error("Provided id is null or undefined");
        }

        this._id = id;
    }
}