"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var JobDTO = /** @class */ (function () {
    // private _rentedEntities: Rentable[] = [];
    function JobDTO() {
        this._equipmentItems = [];
    }
    Object.defineProperty(JobDTO.prototype, "id", {
        get: function () {
            return this._id;
        },
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
    Object.defineProperty(JobDTO.prototype, "cameraman", {
        // public get rentedEntities(): Rentable[] {
        //     return this._rentedEntities;
        // }
        get: function () {
            if (this._cameraman !== undefined) {
                return this._cameraman;
            }
            return undefined;
        },
        set: function (cameraman) {
            this._cameraman = cameraman;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(JobDTO.prototype, "equipmentItems", {
        get: function () {
            if (this._equipmentItems !== undefined) {
                return this._equipmentItems;
            }
            return [];
        },
        // public set rentedEntities(rentedEntities: Rentable[]) {
        //     if (isNullOrUndefined(rentedEntities)) {
        //         this._rentedEntities = [];
        //     } else {
        //         this._rentedEntities = rentedEntities;
        //     }
        // }
        set: function (equipmentItems) {
            if (util_1.isNullOrUndefined(equipmentItems)) {
                this._equipmentItems = [];
            }
            else {
                this._equipmentItems = equipmentItems;
            }
        },
        enumerable: true,
        configurable: true
    });
    return JobDTO;
}());
exports.JobDTO = JobDTO;
//# sourceMappingURL=jobDTO.js.map