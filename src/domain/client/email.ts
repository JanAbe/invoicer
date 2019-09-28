import { isNullOrUndefined } from "util";

export class Email {
    private _emailAddress!: string;

    constructor(emailAddress: string) {
        this.setEmailAddress(emailAddress);
    }
    
    public get emailAddress(): string {
        return this._emailAddress;
    }

    private setEmailAddress(emailAddress: string): void {
        const validationRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        
        if (isNullOrUndefined(emailAddress)) {
            throw new Error("Provided emailAddress is null or undefined.");
        }

        if (!validationRegex.test(emailAddress)) {
            throw new Error("Provided emailaddress is invalid");
        }

        this._emailAddress = emailAddress;
    }
}