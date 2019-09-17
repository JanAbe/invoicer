"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class JobDTO {
    // private _rentedEntities: Rentable[] = [];
    constructor() {
        this._equipmentItems = [];
    }
    get id() {
        return this._id;
    }
    get description() {
        return this._description;
    }
    get location() {
        return this._location;
    }
    get directedBy() {
        return this._directedBy;
    }
    get clientID() {
        return this._clientID;
    }
    // public get rentedEntities(): Rentable[] {
    //     return this._rentedEntities;
    // }
    get cameraman() {
        if (this._cameraman !== undefined) {
            return this._cameraman;
        }
        return undefined;
    }
    get equipmentItems() {
        if (this._equipmentItems !== undefined) {
            return this._equipmentItems;
        }
        return [];
    }
    set id(id) {
        this._id = id;
    }
    set description(description) {
        this._description = description;
    }
    set location(location) {
        this._location = location;
    }
    set directedBy(directedBy) {
        this._directedBy = directedBy;
    }
    set clientID(clientID) {
        this._clientID = clientID;
    }
    // public set rentedEntities(rentedEntities: Rentable[]) {
    //     if (isNullOrUndefined(rentedEntities)) {
    //         this._rentedEntities = [];
    //     } else {
    //         this._rentedEntities = rentedEntities;
    //     }
    // }
    set equipmentItems(equipmentItems) {
        if (util_1.isNullOrUndefined(equipmentItems)) {
            this._equipmentItems = [];
        }
        else {
            this._equipmentItems = equipmentItems;
        }
    }
    set cameraman(cameraman) {
        this._cameraman = cameraman;
    }
}
exports.JobDTO = JobDTO;
//# sourceMappingURL=jobDTO.js.map