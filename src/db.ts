import sqlite3 = require("sqlite3");

export class DB {
    private _db: sqlite3.Database;

    constructor(dbFilepath: string) {
        this._db = new sqlite3.Database(dbFilepath, (err) => {
            if (err) {
                console.log("Could not connect to the database", err);
            } else {
                console.log("Connected to the database");
            }
        });
    }

    // for running insert, update and delete statements
    public run(query: string, params: any = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function (err) {
                if (err) {
                    console.log(`${err} running SQL query: ${query}`);
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    // get single result
    public get(query: string, params: any = []): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, function (err, row) {
                if (err) {
                    console.log(`${err} running SQL query: ${query}`);
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // get multiple results
    public all(query: string, params: any = []): Promise<any[]> {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, function (err, rows) {
                if (err) {
                    console.log(`${err} running SQL query: ${query}`);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    public get db(): sqlite3.Database {
        return this._db;
    }

    public createTables(): void {
        // Sqlite3 apparently doesn't support creating multiple tables at once
        // Because of this, a query for each table has been made.

        const createTableAddress = `
            CREATE TABLE IF NOT EXISTS Address (
                city TEXT,
                street TEXT,
                house_number INTEGER,
                zipcode TEXT
            );
        `;

        const createTableUser = `
            CREATE TABLE IF NOT EXISTS User (
                id TEXT PRIMARY KEY,
                first_name TEXT,
                last_name TEXT,
                iban TEXT,
                company_name TEXT,
                job_title TEXT,
                bank_account_nr INTEGER,
                phone_number TEXT,
                mobile_number TEXT,
                email TEXT,
                chamber_of_commerce_nr TEXT,
                vat_id_nr TEXT,
                var_nr TEXT,
                city TEXT,
                zipcode TEXT,
                street TEXT,
                house_number INTEGER
            );
        `;

        const createTableCameraman = `
            CREATE TABLE IF NOT EXISTS Cameraman (
                id TEXT PRIMARY KEY,
                firstName TEXT,
                lastName TEXT
            );
        `;

        const createTableEquipmentItem = `
            CREATE TABLE IF NOT EXISTS Equipment_Item (
                id TEXT PRIMARY KEY,
                name TEXT
            );
        `;

        const createTableClient = `
            CREATE TABLE IF NOT EXISTS Client (
                id TEXT PRIMARY KEY,
                firstName TEXT,
                lastName TEXT,
                email TEXT,
                city TEXT,
                street TEXT,
                houseNumber INTEGER,
                zipcode TEXT
            );
        `;

        const createTableJob = `
            CREATE TABLE IF NOT EXISTS Job (
                id TEXT PRIMARY KEY,
                description TEXT,
                location TEXT,
                directed_by TEXT,
                ref_client TEXT,
                FOREIGN KEY(ref_client) REFERENCES Client(id)
            );
        `;

        const createTableRentedEntity = `
            CREATE TABLE IF NOT EXISTS Rented_Entity (
                id TEXT PRIMARY KEY,
                start_date TEXT,
                end_date TEXT,
                day_price REAL,
                ref_job TEXT,
                ref_cameraman TEXT,
                ref_equipment_item TEXT,
                FOREIGN KEY(ref_job) REFERENCES Job(id) ON DELETE CASCADE,
                FOREIGN KEY(ref_cameraman) REFERENCES Cameraman(id),
                FOREIGN KEY(ref_equipment_item) REFERENCES Equipment_Item(id)
            );
        `;

        const createTableInvoice = `
            CREATE TABLE IF NOT EXISTS Invoice (
                id TEXT PRIMARY KEY,
                invoice_number TEXT,
                iban TEXT,
                creation_date TEXT,
                ref_job TEXT,
                FOREIGN KEY(ref_job) REFERENCES Job(id) ON DELETE CASCADE
            );
        `;

        this.db.run('PRAGMA foreign_keys = ON'); // to enable foreign-keys
        this.db.run(createTableAddress);
        this.db.run(createTableUser);
        this.db.run(createTableCameraman);
        this.db.run(createTableEquipmentItem);
        this.db.run(createTableClient);
        this.db.run(createTableJob);
        this.db.run(createTableRentedEntity);
        this.db.run(createTableInvoice);
    }
}