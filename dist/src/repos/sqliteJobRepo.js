"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid/v4");
var jobID_1 = require("../domain/jobID");
var SqliteJobRepo = /** @class */ (function () {
    function SqliteJobRepo(db) {
        this._db = db;
    }
    SqliteJobRepo.prototype.nextID = function () {
        return new jobID_1.JobID(uuid());
    };
    SqliteJobRepo.prototype.jobOfID = function (jobID) {
        throw new Error();
    };
    SqliteJobRepo.prototype.save = function (job) {
        var query = 'INSERT INTO Client (id, firstName, lastName, email, city, street, houseNumber, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
        return this._db.run(query, [job.id.toString(),
            job.client.fullName.firstName,
            job.client.fullName.lastName,
            job.client.email.emailAddress,
            job.client.address.city,
            job.client.address.street,
            job.client.address.houseNumber,
            job.client.address.zipcode]);
    };
    return SqliteJobRepo;
}());
exports.SqliteJobRepo = SqliteJobRepo;
