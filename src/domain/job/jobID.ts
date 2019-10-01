import { isNullOrUndefined } from "util";
import { isEmpty } from "../../util/helpers";

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

        if (isEmpty(id)) {
            throw new Error("Provided id can not be empty");
        }

        this._id = id;
    }
}