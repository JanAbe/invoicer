"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3 = require("sqlite3");
var DB = /** @class */ (function () {
    function DB(dbFilepath) {
        this._db = new sqlite3.Database(dbFilepath, function (err) {
            if (err) {
                console.log("Could not connect to the database", err);
            }
            else {
                console.log("Connected to the database");
            }
        });
    }
    Object.defineProperty(DB.prototype, "db", {
        get: function () {
            return this._db;
        },
        enumerable: true,
        configurable: true
    });
    DB.prototype.initializeDatabase = function () {
        var query = "\n            CREATE TABLE IF NOT EXISTS test (\n                id TEXT PRIMARY KEY,\n                name TEXT)";
        this.db.run(query);
    };
    return DB;
}());
exports.DB = DB;
