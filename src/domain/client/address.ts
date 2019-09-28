import { isNullOrUndefined } from "util";
import { isEmpty } from "../../util/helpers";

export class Address {
    private _city!: string;
    private _street!: string;
    private _houseNumber!: number;
    private _zipcode!: string;

    constructor(city: string, street: string, houseNumber: number, zipcode: string) {
        this.setCity(city);
        this.setStreet(street);
        this.setHouseNumber(houseNumber);
        this.setZipcode(zipcode);
    }
    
    public get city(): string {
        return this._city;
    }

    public get street(): string {
        return this._street;
    }
    
    public get houseNumber(): number {
        return this._houseNumber;
    }
    
    public get zipcode(): string {
        return this._zipcode;
    }

    private setCity(city: string): void {
        if (isNullOrUndefined(city)) {
            throw new Error("Provided city is null or undefined");
        }

        if (isEmpty(city)) {
            throw new Error("Provided city can not be empty");
        }

        this._city = city;
    }
    
    private setStreet(street: string): void {
        if (isNullOrUndefined(street)) {
            throw new Error("Provided street is null or undefined");
        }

        if (isEmpty(street)) {
            throw new Error("Provided street can not be empty");
        }

        this._street = street;
    }
    
    private setHouseNumber(houseNumber: number): void {
        const MINIMUM_HOUSE_NUMBER = 0;

        if (isNullOrUndefined(houseNumber)) {
            throw new Error("Provided houseNumber is null or undefined");
        }

        if (houseNumber < MINIMUM_HOUSE_NUMBER) {
            throw new Error("Provided houseNumber can not be smaller than the minimum house number (0)");
        }

        this._houseNumber = houseNumber;
    }
    
    private setZipcode(zipcode: string): void {
        const validationRegex = /^\d{4}\s*[a-zA-z]{2}$/;

        if (isNullOrUndefined(zipcode)) {
            throw new Error("Provided zipcode is null or undefined");
        }

        if (!validationRegex.test(zipcode)) {
            throw new Error("Provided zipcode is invalid.");
        }

        // remove all whitespaces
        zipcode = zipcode.replace(/\s/g, '');
        zipcode = zipcode.toUpperCase();
        this._zipcode = zipcode;
    }
    
}