import { Period } from "./period";
import { JobID } from "./jobID";
import { isNullOrUndefined } from "util";
import { ClientID } from "./clientID";
import { Cameraman } from "./cameraman";
import { EquipmentItem } from "./equipmentItem";

export class Job {
    private _id: JobID;
    private _description: string;
    private _location: string;
    private _directedBy: string; // wat is regie in het engels?
    private _clientID: ClientID;
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
                clientID: ClientID,
                cameraman?: Cameraman,
                equipmentItems?: EquipmentItem[]) {
        this._id = id;
        this._description = description;
        this._location = location;
        this._directedBy = directedBy;
        this._clientID = clientID;
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

    public get clientID(): ClientID {
        return this._clientID;
    }

    public get cameraman(): Cameraman {
        return this._cameraman;
    }

    public get equipmentItems(): EquipmentItem[] {
        return this._equipmentItems;
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
    
    public set clientID(clientID: ClientID) {
        if (isNullOrUndefined(clientID)) {
            throw new Error("Provided clientID is null or undefined");
        }

        this._clientID = clientID;
    }
    
    public set equipmentItems(equipmentItems: EquipmentItem[]) {
        if (isNullOrUndefined(equipmentItems)) {
            this._equipmentItems = [];
        }

        this._equipmentItems = equipmentItems;
    }
}