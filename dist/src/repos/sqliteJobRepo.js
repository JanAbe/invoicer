"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid = require("uuid/v4");
var jobID_1 = require("../domain/jobID");
var SqliteJobRepo = /** @class */ (function () {
    function SqliteJobRepo() {
    }
    SqliteJobRepo.prototype.nextID = function () {
        return new jobID_1.JobID(uuid());
    };
    SqliteJobRepo.prototype.jobOfID = function (jobID) {
        throw new Error();
    };
    SqliteJobRepo.prototype.save = function (job) {
        throw new Error();
    };
    return SqliteJobRepo;
}());
exports.SqliteJobRepo = SqliteJobRepo;
