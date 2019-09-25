"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserDTO {
    // todo: create a user domain object with correct value objects and stuff.
    constructor(id, firstName, lastName, iban, companyName, jobTitle, bankAccountNr, phoneNr, mobileNr, email, chamberOfCommerceNr, vatNr, varNr, city, zipcode, street, houseNr) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.iban = iban;
        this.companyName = companyName;
        this.jobTitle = jobTitle;
        this.bankAccountNr = bankAccountNr;
        this.phoneNr = phoneNr;
        this.mobileNr = mobileNr;
        this.email = email;
        this.chamberOfCommerceNr = chamberOfCommerceNr;
        this.vatNr = vatNr;
        this.varNr = varNr;
        this.city = city;
        this.zipcode = zipcode;
        this.street = street;
        this.houseNr = houseNr;
    }
}
exports.UserDTO = UserDTO;
//# sourceMappingURL=userDTO.js.map