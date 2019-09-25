import { Client } from "./client";
import { ClientID } from "./clientID";

export interface ClientRepo {
    nextID(): ClientID;

    clientOfID(clientID: ClientID): Promise<Client>;

    save(client: Client): void;
}