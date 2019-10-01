
export class UserDTO {
    public id: string;
    public firstName: string;
    public lastName: string;
    public iban: string;
    public companyName: string;
    public jobTitle: string;
    public bankAccountNr: string;
    public phoneNr: string;
    public mobileNr: string;
    public email: string;
    public chamberOfCommerceNr: string;
    public vatNr: string;
    public varNr: string;
    public city: string;
    public zipcode: string;
    public street: string;
    public houseNr: string;

    constructor(id: string,
        firstName: string,
        lastName: string,
        iban: string,
        companyName: string,
        jobTitle: string,
        bankAccountNr: string,
        phoneNr: string,
        mobileNr: string,
        email: string,
        chamberOfCommerceNr: string,
        vatNr: string,
        varNr: string,
        city: string,
        zipcode: string,
        street: string,
        houseNr: string) {
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.iban = iban;
            this.companyName = companyName;
            this.jobTitle = jobTitle;
            this.bankAccountNr = bankAccountNr;
            this.phoneNr = phoneNr;
            this.mobileNr = mobileNr;
            this.email= email;
            this.chamberOfCommerceNr = chamberOfCommerceNr;
            this.vatNr = vatNr;
            this.varNr = varNr;
            this.city = city;
            this.zipcode = zipcode;
            this.street = street;
            this.houseNr = houseNr;
        }
}