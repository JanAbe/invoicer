"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var clientID_1 = require("../domain/clientID");
var uuid = require("uuid");
var SqliteClientRepo = /** @class */ (function () {
    function SqliteClientRepo(db) {
        this._db = db;
    }
    SqliteClientRepo.prototype.nextID = function () {
        return new clientID_1.ClientID(uuid());
    };
    SqliteClientRepo.prototype.clientOfID = function (clientID) {
        var query = 'SELECT id, firstName, lastName, email, city, street, houseNumber, zipcode FROM Client;';
        return this._db.get(query, [clientID.toString()]);
    };
    SqliteClientRepo.prototype.save = function (client) {
        var query = 'INSERT INTO Client (id, firstName, lastName, email, city, street, houseNumber, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
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
    };
    return SqliteClientRepo;
}());
exports.SqliteClientRepo = SqliteClientRepo;
