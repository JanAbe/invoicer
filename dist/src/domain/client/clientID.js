"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class ClientID {
    constructor(id) {
        this.setID(id);
    }
    toString() {
        return this._id;
    }
    setID(id) {
        // todo: needs check to see if incoming string is a UUID4
        if (util_1.isNullOrUndefined(id)) {
            throw new Error("Provided id is null or undefined");
        }
        this._id = id;
    }
}
exports.ClientID = ClientID;
//# sourceMappingURL=clientID.js.map