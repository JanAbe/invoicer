import { ClientRepo } from "./clientRepo";
import { DB } from "../db";
import { ClientID } from "../domain/clientID";
import uuid = require("uuid");
import { Client } from "../domain/client";

export class SqliteClientRepo implements ClientRepo {
    private _db: DB;

    constructor(db: DB) {
        this._db = db;
    }

    public nextID(): ClientID {
        return new ClientID(uuid());
    }

    public clientOfID(clientID: ClientID): Promise<Client> {
        const query = 'SELECT id, firstName, lastName, email, city, street, houseNumber, zipcode FROM Client;';
        return this._db.get(query, [clientID.toString()]);
    }

    public save(client: Client): void {
        const query = 'INSERT INTO Client (id, firstName, lastName, email, city, street, houseNumber, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
        this._db.run(query, [
            client.id.toString(), 
            client.fullName.firstName,
            client.fullName.lastName,
            client.email.emailAddress,
            client.address.city,
            client.address.street,
            client.address.houseNumber,
            client.address.zipcode
        ]);
    }
}