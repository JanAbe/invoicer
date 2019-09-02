"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ClientID = /** @class */ (function () {
    function ClientID(id) {
        this._id = id;
    }
    ClientID.prototype.toString = function () {
        return this._id;
    };
    ClientID.prototype.setID = function (id) {
        // needs check to see if incoming string is a UUID4
        this._id = id;
    };
    return ClientID;
}());
exports.ClientID = ClientID;
