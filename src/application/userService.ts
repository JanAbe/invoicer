import { UserRepo } from "../domain/user/userRepo";
import { UserDTO } from "../domain/dto/userDTO";

export class UserService {
    private readonly _userRepo: UserRepo;

    constructor(userRepo: UserRepo) {
        this._userRepo = userRepo;
    }

    public async createUser(userProps: any): Promise<string> {
        const { id, firstName, lastName, iban, companyName,
                jobTitle, bankAccountNr, phoneNr, mobileNr, 
                email, coc, vatNr, varNr, city, zipcode, street, houseNr } = userProps;

        const userDTO = new UserDTO(
            id,
            firstName,
            lastName,
            iban,
            companyName,
            jobTitle,
            bankAccountNr,
            phoneNr,
            mobileNr,
            email,
            coc, 
            vatNr,
            varNr,
            city,
            zipcode,
            street,
            houseNr
        );

        return await this._userRepo.saveOrUpdate(userDTO);
    }

    public async fetchUserByID(userID: string): Promise<UserDTO> {
        if (userID === undefined) {
            throw new Error('Provided userID is undefined');
        }

        return await this._userRepo.userOfID(userID);
    }
}