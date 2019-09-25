import { ClientRepo } from "../../../domain/client/clientRepo";
import { DB } from "../../../db";
import { Client } from "../../../domain/client/client";
import { ClientID } from "../../../domain/client/clientID";
import { FullName } from "../../../domain/client/fullName";
import { Email } from "../../../domain/client/email";
import { Address } from "../../../domain/client/address";
import uuid = require("uuid");

export class SqliteClientRepo implements ClientRepo {
    private _db: DB;

    constructor(db: DB) {
        this._db = db;
    }

    public nextID(): ClientID {
        return new ClientID(uuid());
    }

    public async clientOfID(clientID: ClientID): Promise<Client> {
        const query = 'SELECT id, firstName, lastName, email, city, street, houseNumber, zipcode FROM Client WHERE id = ?;';
        const row = await this._db.get(query, [clientID.toString()]);
        return new Client(new ClientID(row.id), 
                          new FullName(row.firstName, row.lastName), 
                          new Email(row.email), 
                          new Address(row.city, row.street, row.houseNumber, row.zipcode));
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