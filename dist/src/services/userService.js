"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const userDTO_1 = require("../domain/dto/userDTO");
class UserService {
    constructor(userRepo) {
        this._userRepo = userRepo;
    }
    createUser(userProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, firstName, lastName, iban, companyName, jobTitle, bankAccountNr, phoneNr, mobileNr, email, coc, vatNr, varNr, city, zipcode, street, houseNr } = userProps;
            const userDTO = new userDTO_1.UserDTO(id, firstName, lastName, iban, companyName, jobTitle, bankAccountNr, phoneNr, mobileNr, email, coc, vatNr, varNr, city, zipcode, street, houseNr);
            return yield this._userRepo.saveOrUpdate(userDTO);
        });
    }
    fetchUserByID(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._userRepo.userOfID(userID);
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=userService.js.map