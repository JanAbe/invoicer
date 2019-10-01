"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const helpers_1 = require("../../util/helpers");
class JobID {
    constructor(id) {
        // needs check to see if incoming string is a UUID4
        this.setID(id);
    }
    toString() {
        return this._id;
    }
    setID(id) {
        if (util_1.isNullOrUndefined(id)) {
            throw new Error("Provided id can not be null or undefined");
        }
        if (helpers_1.isEmpty(id)) {
            throw new Error("Provided id can not be empty");
        }
        this._id = id;
    }
}
exports.JobID = JobID;
//# sourceMappingURL=jobID.js.map