import { FullName } from "./fullName";
import { Email } from "./email";
import { Address } from "./address";
import { isNullOrUndefined } from "util";

// moet rekeningnummer worden toegevoegd aan Client?
// is het zo dat de opdrachtgever van de klus ook 
// degene is aan wie de rekening verzonden moet worden.
export class Client {
    private _fullName: FullName;
    private _email: Email;
    private _address: Address;

    constructor(fullName: FullName, email: Email, address: Address) {
        this._fullName = fullName;
        this._email = email;
        this._address = address;
    }

    public get fullName(): FullName {
        return this._fullName;
    }

    public get email(): Email {
        return this._email;
    }

    public get address(): Address {
        return this._address;
    }

    public set fullName(fullName: FullName) {
        if (isNullOrUndefined(fullName)) {
            throw new Error("Provided fullName is null or undefined");
        }

        this._fullName = fullName;
    }

    public set email(email: Email) {
        if (isNullOrUndefined(email)) {
            throw new Error("Provided email is null or undefined");
        }

        this._email = email;
    }
        
    public set address(address: Address) {
        if (isNullOrUndefined(address)) {
            throw new Error("Provided address is null or undefined");
        }

        this._address = address;
    }
    
}