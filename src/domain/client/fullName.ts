import { isNullOrUndefined } from "util";
import { isEmpty } from "../../util/helpers";

export class FullName {
    private _firstName!: string;
    private _lastName!: string;

    constructor(firstName: string, lastName: string) {
        this.setFirstName(firstName);
        this.setLastName(lastName);
    }
    
    public get firstName(): string {
        return this._firstName;
    }
    
    public get lastName(): string {
        return this._lastName;
    }

    private setFirstName(firstName: string): void {
        if (isNullOrUndefined(firstName)) {
            throw new Error("Provided firstname is null or undefined.");
        }

        if (isEmpty(firstName)) {
            throw new Error("Provided firstName is empty");
        }

        this._firstName = firstName.trim();
    }

    private setLastName(lastName: string): void {
        if (isNullOrUndefined(lastName)) {
            throw new Error("Provided lastname is null or undefined.");
        }

        if (isEmpty(lastName)) {
            throw new Error("Provided lastname is empty");
        }

        this._lastName = lastName.trim();
    }

    public toString(): string {
        return [this.firstName, this.lastName].join(' ');
    }
}