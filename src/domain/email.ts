import { isNullOrUndefined } from "util";

export class Email {
    private _emailAddress: string;

    constructor(emailAddress: string) {
        this.setEmailAddress(emailAddress);
    }
    
    public get emailAddress(): string {
        return this._emailAddress;
    }

    private setEmailAddress(emailAddress: string): void {
        if (isNullOrUndefined(emailAddress)) {
            throw new Error("Provided emailAddress is null or undefined.");
        }

        if (!this.isValid(emailAddress)) {
            throw new Error("Provided emailAddress is invalid.");
        } 

        this._emailAddress = emailAddress;
    }

    // TODO: add more checks
    // isValid checks if the provided emailAddress is valid 
    private isValid(emailAddress: string): boolean {
        if (emailAddress.includes("@")) {
            return true;
        }

        return false;
    }
}