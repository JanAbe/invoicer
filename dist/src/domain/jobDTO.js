"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var JobDTO = /** @class */ (function () {
    function JobDTO() {
        // private _cameraman?: Cameraman;
        // private _equipmentItems?: EquipmentItem[];
        this._rentedEntities = [];
    }
    Object.defineProperty(JobDTO.prototype, "id", {
        get: function () {
            return this._id;
        },
        // public get cameraman(): Cameraman | undefined {
        //     if (this._cameraman !== undefined) {
        //         return this._cameraman;
        //     }
        //     return undefined;
        // }
        // public get equipmentItems(): EquipmentItem[] {
        //     if (this._equipmentItems !== undefined) {
        //         return this._equipmentItems;
        //     }
        //     return [];
        // }
        set: function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JobDTO.prototype, "description", {
        get: function () {
            return this._description;
        },
        set: function (description) {
            this._description = description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JobDTO.prototype, "location", {
        get: function () {
            return this._location;
        },
        set: function (location) {
            this._location = location;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JobDTO.prototype, "directedBy", {
        get: function () {
            return this._directedBy;
        },
        set: function (directedBy) {
            this._directedBy = directedBy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JobDTO.prototype, "clientID", {
        get: function () {
            return this._clientID;
        },
        set: function (clientID) {
            this._clientID = clientID;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JobDTO.prototype, "rentedEntities", {
        get: function () {
            return this._rentedEntities;
        },
        set: function (rentedEntities) {
            if (util_1.isNullOrUndefined(rentedEntities)) {
                this._rentedEntities = [];
            }
            else {
                this._rentedEntities = rentedEntities;
            }
        },
        enumerable: true,
        configurable: true
    });
    return JobDTO;
}());
exports.JobDTO = JobDTO;
