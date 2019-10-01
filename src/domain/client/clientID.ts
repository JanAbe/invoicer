import { isNullOrUndefined } from "util";
import { isEmpty } from "../../util/helpers";

export class ClientID {
    private _id!: string;

    constructor(id: string) {
        this.setID(id);
    }

    public toString(): string {
        return this._id;
    }

    private setID(id: string): void {
        if (isNullOrUndefined(id)) {
            throw new Error("Provided id is null or undefined");
        }

        if (isEmpty(id)) {
            throw new Error("Provided id can not be empty");
        }

        this._id = id;
    }
}