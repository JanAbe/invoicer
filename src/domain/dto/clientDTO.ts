
export class ClientDTO {
    public firstName?: string;
    public lastName?: string;
    public email?: string;
    public city?: string;
    public street?: string;
    public houseNumber?: number;
    public zipcode?: string;
    public id?: string;

    constructor(
        firstName?: string,
        lastName?: string,
        email?: string,
        city?: string,
        street?: string,
        houseNumber?: number,
        zipcode?: string,
        id?: string,
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.city = city;
        this.street = street;
        this.houseNumber = houseNumber;
        this.zipcode = zipcode;
        this.id = id;
    }
}