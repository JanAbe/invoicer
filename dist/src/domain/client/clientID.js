"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClientID {
    constructor(id) {
        this._id = id;
    }
    toString() {
        return this._id;
    }
    setID(id) {
        // needs check to see if incoming string is a UUID4
        this._id = id;
    }
}
exports.ClientID = ClientID;
//# sourceMappingURL=clientID.js.map