"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class Job {
    // of wel een propety _period: Period toevoegen
    // dan tijdens het toevoegen van een cameraman en apparatuurItems
    // kijken of de opgegeven periodes daarvan, binnen de periode van de klus vallen
    constructor(id, description, location, directedBy, clientID, cameraman, equipmentItems = [], comment) {
        this._id = id;
        this._description = description;
        this._location = location;
        this._directedBy = directedBy;
        this._clientID = clientID;
        this._cameraman = cameraman;
        this._equipmentItems = equipmentItems;
        this._comment = comment;
    }
    static fromDTO(jobDTO) {
        return new Job(jobDTO.id, jobDTO.description, jobDTO.location, jobDTO.directedBy, jobDTO.clientID, jobDTO.cameraman, jobDTO.equipmentItems);
    }
    calculateCost() {
        let cost = 0;
        if (!util_1.isNullOrUndefined(this.cameraman)) {
            cost += this.cameraman.calculateCost();
        }
        if (!util_1.isNullOrUndefined(this.equipmentItems) && this.equipmentItems.length !== 0) {
            this.equipmentItems.forEach(item => cost += item.calculateCost());
        }
        return cost;
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
    get comment() {
        return this._comment;
    }
    set id(id) {
        this._id = id;
    }
    set description(description) {
        if (util_1.isNullOrUndefined(description)) {
            throw new Error("Provided description is null or undefined");
        }
        this._description = description;
    }
    set location(location) {
        if (util_1.isNullOrUndefined(location)) {
            throw new Error("Provided location is null or undefined");
        }
        this._location = location;
    }
    set directedBy(directedBy) {
        if (util_1.isNullOrUndefined(directedBy)) {
            throw new Error("Provided argument for 'directedBy' is null or undefined");
        }
        this._directedBy = directedBy;
    }
    set clientID(clientID) {
        if (util_1.isNullOrUndefined(clientID)) {
            throw new Error("Provided clientID is null or undefined");
        }
        this._clientID = clientID;
    }
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
    set comment(comment) {
        if (util_1.isNullOrUndefined(comment)) {
            throw new Error("Provided comment is null or undefined");
        }
        this._comment = comment;
    }
}
exports.Job = Job;
//# sourceMappingURL=job.js.map