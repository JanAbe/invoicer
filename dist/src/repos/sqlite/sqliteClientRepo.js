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
const clientID_1 = require("../../domain/clientID");
const client_1 = require("../../domain/client");
const fullName_1 = require("../../domain/fullName");
const email_1 = require("../../domain/email");
const address_1 = require("../../domain/address");
const uuid = require("uuid");
class SqliteClientRepo {
    constructor(db) {
        this._db = db;
    }
    nextID() {
        return new clientID_1.ClientID(uuid());
    }
    clientOfID(clientID) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = 'SELECT id, firstName, lastName, email, city, street, houseNumber, zipcode FROM Client WHERE id = ?;';
            const row = yield this._db.get(query, [clientID.toString()]);
            return new client_1.Client(new clientID_1.ClientID(row.id), new fullName_1.FullName(row.firstName, row.lastName), new email_1.Email(row.email), new address_1.Address(row.city, row.street, row.houseNumber, row.zipcode));
        });
    }
    save(client) {
        const query = 'INSERT INTO Client (id, firstName, lastName, email, city, street, houseNumber, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
        this._db.run(query, [
            client.id.toString(),
            client.fullName.firstName,
            client.fullName.lastName,
            client.email.emailAddress,
            client.address.city,
            client.address.street,
            client.address.houseNumber,
            client.address.zipcode
        ]);
    }
}
exports.SqliteClientRepo = SqliteClientRepo;
//# sourceMappingURL=sqliteClientRepo.js.map