"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var Job = /** @class */ (function () {
    // of wel een propety _period: Period toevoegen
    // dan tijdens het toevoegen van een cameraman en apparatuurItems
    // kijken of de opgegeven periodes daarvan, binnen de periode van de klus vallen
    // ergens moet een check komen dat er altijd OF een cameraman of
    // een apparatuurItem aanwezig moet zijn. Tenminste 1 van de twee.
    function Job(id, description, location, directedBy, client, cameraman, equipmentItems) {
        this._id = id;
        this._description = description;
        this._location = location;
        this._directedBy = directedBy;
        this._client = client;
        this._cameraman = cameraman;
        this._equipmentItems = equipmentItems;
    }
    Job.prototype.calculateCost = function () {
        var cost = 0;
        if (!util_1.isNullOrUndefined(this.cameraman)) {
            cost += this.cameraman.calculateCost();
        }
        if (!util_1.isNullOrUndefined(this.equipmentItems) && this.equipmentItems.length !== 0) {
            this.equipmentItems.forEach(function (item) { return cost += item.calculateCost(); });
        }
        return cost;
    };
    Object.defineProperty(Job.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            this._id = id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Job.prototype, "description", {
        get: function () {
            return this._description;
        },
        set: function (description) {
            if (util_1.isNullOrUndefined(description)) {
                throw new Error("Provided description is null or undefined");
            }
            this._description = description;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Job.prototype, "location", {
        get: function () {
            return this._location;
        },
        set: function (location) {
            if (util_1.isNullOrUndefined(location)) {
                throw new Error("Provided location is null or undefined");
            }
            this._location = location;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Job.prototype, "directedBy", {
        get: function () {
            return this._directedBy;
        },
        set: function (directedBy) {
            if (util_1.isNullOrUndefined(directedBy)) {
                throw new Error("Provided argument for 'directedBy' is null or undefined");
            }
            this._directedBy = directedBy;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Job.prototype, "client", {
        get: function () {
            return this._client;
        },
        set: function (client) {
            if (util_1.isNullOrUndefined(client)) {
                throw new Error("Provided client is null or undefined");
            }
            this._client = client;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Job.prototype, "cameraman", {
        get: function () {
            if (this._cameraman !== undefined) {
                return this._cameraman;
            }
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Job.prototype, "equipmentItems", {
        get: function () {
            if (this._equipmentItems !== undefined) {
                return this._equipmentItems;
            }
            return [];
        },
        set: function (equipmentItems) {
            if (util_1.isNullOrUndefined(equipmentItems)) {
                this._equipmentItems = [];
            }
            this._equipmentItems = equipmentItems;
        },
        enumerable: true,
        configurable: true
    });
    return Job;
}());
exports.Job = Job;
