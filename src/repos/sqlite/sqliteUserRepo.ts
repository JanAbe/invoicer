import { UserRepo } from "../userRepo";
import { DB } from "../../db";
import { UserDTO } from "../../domain/dto/userDTO";
import uuid = require("uuid");

export class SqliteUserRepo implements UserRepo {
    private _db: DB;

    constructor(db: DB) {
        this._db = db;
    }

    public async userOfID(userID: string): Promise<UserDTO> {
        const query = 'SELECT id, first_name, last_name, iban, company_name, job_title, bank_account_nr, phone_number, mobile_number, email, chamber_of_commerce_nr, vat_id_nr, var_nr, city, zipcode, street, house_number FROM User WHERE id=?;';
        const row = await this._db.get(query, userID); 
        return new UserDTO(
            row.id,
            row.first_name,
            row.last_name,
            row.iban,
            row.company_name,
            row.job_title,
            row.bank_account_nr,
            row.phone_number,
            row.mobile_number,
            row.email,
            row.chamber_of_commerce_nr,
            row.vat_id_nr,
            row.var_nr,
            row.city,
            row.zipcode,
            row.street,
            row.house_number
        );
    }

    public async saveOrdUpdate(user: UserDTO): Promise<string> {
        const existsQuery = `SELECT id FROM User where id=?;`;
        let id: string = "";
 
        await new Promise((resolve, reject) => {
            const self = this;
            this._db.db.get(existsQuery, user.id, function (err, row) {
                if (err) {
                    reject(err);
                } else {
                    if (row === undefined) {
                        id = uuid();
                        self.save(user, id);
                    } else {
                        self.update(user);
                    }
                    resolve();
                }
            });
        });

        return new Promise((resolve, reject) => {
            resolve(id);
        });
    }

    public save(user: UserDTO, id: string): void {
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

    public update(user: UserDTO): void {
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