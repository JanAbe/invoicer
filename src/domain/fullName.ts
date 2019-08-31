import { isNullOrUndefined } from "util";

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

        this._firstName = firstName.trim();
    }

    private setLastName(lastName: string): void {
        if (isNullOrUndefined(lastName)) {
            throw new Error("Provided lastname is null or undefined.");
        }

        this._lastName = lastName.trim();
    }
}