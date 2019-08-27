import { Period } from "./period";
import { JobID } from "./jobID";
import { isNullOrUndefined } from "util";
import { Client } from "./client";
import { Cameraman } from "./cameraman";
import { EquipmentItem } from "./equipmentItem";

export class Job {
    private _id: JobID;
    private _description: string;
    private _location: string;
    private _directedBy: string; // wat is regie in het engels?
    private _client: Client;
    private _cameraman?: Cameraman;
    private _equipmentItems?: EquipmentItem[];
    // of wel een propety _period: Period toevoegen
    // dan tijdens het toevoegen van een cameraman en apparatuurItems
    // kijken of de opgegeven periodes daarvan, binnen de periode van de klus vallen

    // ergens moet een check komen dat er altijd OF een cameraman of
    // een apparatuurItem aanwezig moet zijn. Tenminste 1 van de twee.
    constructor(id: JobID,
                description: string, 
                location: string, 
                directedBy: string, 
                client: Client,
                cameraman?: Cameraman,
                equipmentItems?: EquipmentItem[]) {
        this._id = id;
        this._description = description;
        this._location = location;
        this._directedBy = directedBy;
        this._client = client;
        this._cameraman = cameraman;
        this._equipmentItems = equipmentItems;
    }

    public calculateCost(): number {
        let cost: number = 0;

        if (!isNullOrUndefined(this.cameraman)) {
            cost += this.cameraman.calculateCost();
        }

        if (!isNullOrUndefined(this.equipmentItems) && this.equipmentItems.length !== 0) {
            this.equipmentItems.forEach(item => cost += item.calculateCost());
        }

        return cost;
    }

    public get id(): JobID {
        return this._id;
    }
    
    public get description(): string {
        return this._description;
    }

    public get location(): string {
        return this._location;
    }

    public get directedBy(): string {
        return this._directedBy;
    }

    public get client(): Client {
        return this._client;
    }

    public get cameraman(): Cameraman | undefined {
        if (this._cameraman !== undefined) {
            return this._cameraman;
        }

        return undefined;
    }

    public get equipmentItems(): EquipmentItem[] {
        if (this._equipmentItems !== undefined) {
            return this._equipmentItems;
        }

        return [];
    }
    
    public set id(id: JobID) {
        this._id = id;
    }
    
    public set description(description: string) {
        if (isNullOrUndefined(description)) {
            throw new Error("Provided description is null or undefined");
        }

        this._description = description;
    }
    
    public set location(location: string) {
        if (isNullOrUndefined(location)) {
            throw new Error("Provided location is null or undefined");
        }

        this._location = location;
    }
    
    public set directedBy(directedBy: string) {
        if (isNullOrUndefined(directedBy)) {
            throw new Error("Provided argument for 'directedBy' is null or undefined");
        }

        this._directedBy = directedBy;
    }
    
    public set client(client: Client) {
        if (isNullOrUndefined(client)) {
            throw new Error("Provided client is null or undefined");
        }

        this._client = client;
    }
    
    public set equipmentItems(equipmentItems: EquipmentItem[]) {
        if (isNullOrUndefined(equipmentItems)) {
            this._equipmentItems = [];
        }

        this._equipmentItems = equipmentItems;
    }
}