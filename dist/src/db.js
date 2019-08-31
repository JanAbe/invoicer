"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sqlite3 = require("sqlite3");
// TODO: make this api better or justpass sqlite3.Database to the repositories
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
    DB.prototype.createTables = function () {
        // Sqlite3 apparently doesn't support creating multiple tables at once
        // Because of this, a query for each table has been made.
        var createTableCameraman = "\n            CREATE TABLE IF NOT EXISTS Cameraman (\n                id TEXT PRIMARY KEY,\n                firstName TEXT,\n                lastName TEXT\n            );\n        ";
        var createTableEquipmentItem = "\n            CREATE TABLE IF NOT EXISTS Equipment_Item (\n                id TEXT PRIMARY KEY,\n                name TEXT\n            );\n        ";
        var createTableClient = "\n            CREATE TABLE IF NOT EXISTS Client (\n                id TEXT PRIMARY KEY,\n                firstName TEXT,\n                lastName TEXT,\n                email TEXT,\n                city TEXT,\n                street TEXT,\n                houseNumber INTEGER,\n                zipcode TEXT\n            );\n        ";
        var createTableJob = "\n            CREATE TABLE IF NOT EXISTS Job (\n                id TEXT PRIMARY KEY,\n                description TEXT,\n                location TEXT,\n                directed_by TEXT,\n                ref_client TEXT,\n                FOREIGN KEY(ref_client) REFERENCES Client(id)\n            );\n        ";
        var createTableRentedEntity = "\n            CREATE TABLE IF NOT EXISTS Rented_Entity (\n                id TEXT PRIMARY KEY,\n                start_date TEXT,\n                end_date TEXT,\n                day_price REAL,\n                ref_job TEXT,\n                ref_cameraman TEXT,\n                ref_equipment_item TEXT,\n                FOREIGN KEY(ref_job) REFERENCES Job(id),\n                FOREIGN KEY(ref_cameraman) REFERENCES Cameraman(id),\n                FOREIGN KEY(ref_equipment_item) REFERENCES Equipment_Item(id)\n            );\n        ";
        var createTableInvoice = "\n            CREATE TABLE IF NOT EXISTS Invoice (\n                id TEXT PRIMARY KEY,\n                iban TEXT,\n                creation_date TEXT,\n                ref_job TEXT,\n                FOREIGN KEY(ref_job) REFERENCES Job(id)\n            );\n        ";
        this.db.run(createTableCameraman);
        this.db.run(createTableEquipmentItem);
        this.db.run(createTableClient);
        this.db.run(createTableJob);
        this.db.run(createTableRentedEntity);
        this.db.run(createTableInvoice);
    };
    return DB;
}());
exports.DB = DB;
