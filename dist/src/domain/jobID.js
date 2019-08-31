"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var JobID = /** @class */ (function () {
    function JobID(id) {
        // needs check to see if incoming string is a UUID4
        this._id = id;
    }
    JobID.prototype.toString = function () {
        return this._id;
    };
    JobID.prototype.setID = function (id) {
        if (util_1.isNullOrUndefined(id)) {
            throw new Error("Provided id can not be null or undefined");
        }
        this._id = id;
    };
    return JobID;
}());
exports.JobID = JobID;
