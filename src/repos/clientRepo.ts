import { Client } from "../domain/client";
import { ClientID } from "../domain/clientID";

export interface ClientRepo {
    nextID(): ClientID;

    clientOfID(clientID: ClientID): Promise<Client>;

    save(client: Client): void;
}