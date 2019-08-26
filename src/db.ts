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

    public get db(): sqlite3.Database {
        return this._db;
    }

    public initializeDatabase(): void {
        const query = `
            CREATE TABLE IF NOT EXISTS test (
                id TEXT PRIMARY KEY,
                name TEXT)`;

        this.db.run(query);
    }
}