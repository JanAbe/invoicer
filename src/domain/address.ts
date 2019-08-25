import { isNullOrUndefined } from "util";

export class Address {
    private _city: string;
    private _street: string;
    private _houseNumber: number;
    private _zipcode: string;

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
        const MINIMUM_CITY_NAME_LENGTH = 1;

        if (isNullOrUndefined(city)) {
            throw new Error("Provided city is null or undefined");
        }

        if (city.length < MINIMUM_CITY_NAME_LENGTH) {
            throw new Error("Provided city can not have a length that is smaller than the minimum city name length (1)");
        }

        this._city = city;
    }
    
    private setStreet(street: string): void {
        const MINIMUM_STREET_NAME_LENGTH = 1;

        if (isNullOrUndefined(street)) {
            throw new Error("Provided street is null or undefined");
        }

        if (street.length < MINIMUM_STREET_NAME_LENGTH) {
            throw new Error("Provided street can not have a length that is smaller than the minimum street name length (1)");
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
        const DUTCH_ZIPCODE_LENGTH = 6;

        if (isNullOrUndefined(zipcode)) {
            throw new Error("Provided zipcode is null or undefined");
        }

        if (zipcode.length !== DUTCH_ZIPCODE_LENGTH) {
            throw new Error("Provided zipcode has a length that is different than the length of Dutch zipcodes.");
        }

        this._zipcode = zipcode;
    }
    
}