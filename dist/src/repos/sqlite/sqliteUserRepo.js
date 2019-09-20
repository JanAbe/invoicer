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
const userDTO_1 = require("../../domain/dto/userDTO");
const uuid = require("uuid");
class SqliteUserRepo {
    constructor(db) {
        this._db = db;
    }
    userOfID(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT id, first_name, last_name, iban, company_name, job_title, bank_account_nr, phone_number, mobile_number, email, chamber_of_commerce_nr, vat_id_nr, var_nr, city, zipcode, street, house_number FROM User WHERE id=?;';
            const row = yield this._db.get(query, userID);
            return new userDTO_1.UserDTO(row.id, row.first_name, row.last_name, row.iban, row.company_name, row.job_title, row.bank_account_number, row.phone_number, row.mobile_number, row.email, row.chamber_of_commerce_nr, row.vat_id_nr, row.var_nr, row.city, row.zipcode, row.street, row.house_nr);
        });
    }
    saveOrdUpdate(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const existsQuery = `SELECT id FROM User where id=?;`;
            let id = "";
            yield new Promise((resolve, reject) => {
                const self = this;
                this._db.db.get(existsQuery, user.id, function (err, row) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        if (row === undefined) {
                            id = uuid();
                            self.save(user, id);
                        }
                        else {
                            self.update(user);
                        }
                        resolve();
                    }
                });
            });
            return new Promise((resolve, reject) => {
                resolve(id);
            });
        });
    }
    save(user, id) {
        const insertQuery = `INSERT INTO User(id, first_name, last_name, iban, company_name, job_title, bank_account_nr, phone_number, mobile_number, email, chamber_of_commerce_nr, vat_id_nr, var_nr, city, zipcode, street, house_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        this._db.run(insertQuery, [
            id,
            user.firstName,
            user.lastName,
            user.iban,
            user.companyName,
            user.jobTitle,
            user.bankAccountNr,
            user.phoneNr,
            user.mobileNr,
            user.email,
            user.chamberOfCommerceNr,
            user.vatNr,
            user.varNr,
            user.city,
            user.zipcode,
            user.street,
            Number(user.houseNr)
        ]);
    }
    update(user) {
        const updateQuery = `UPDATE User SET first_name=?, last_name=?, iban=?, company_name=?, job_title=?, bank_account_nr=?, phone_number=?, mobile_number=?, email=?, chamber_of_commerce_nr=?, vat_id_nr=?, var_nr=?, city=?, zipcode=?, street=?, house_number=? WHERE id=?;`;
        this._db.run(updateQuery, [
            user.firstName,
            user.lastName,
            user.iban,
            user.companyName,
            user.jobTitle,
            user.bankAccountNr,
            user.phoneNr,
            user.mobileNr,
            user.email,
            user.chamberOfCommerceNr,
            user.vatNr,
            user.varNr,
            user.city,
            user.zipcode,
            user.street,
            Number(user.houseNr),
            user.id,
        ]);
    }
}
exports.SqliteUserRepo = SqliteUserRepo;
//# sourceMappingURL=sqliteUserRepo.js.map