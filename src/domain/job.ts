import { Period } from "./period";
import { JobID } from "./jobID";
import { isNullOrUndefined } from "util";
import { Client } from "./client";
import { Cameraman } from "./cameraman";
import { EquipmentItem } from "./equipmentItem";
import { ClientID } from "./clientID";
import { Rentable } from "./rentable";
import { JobDTO } from "./jobDTO";

export class Job {
    private _id?: JobID;
    private _description?: string;
    private _location?: string;
    private _directedBy?: string; // wat is regie in het engels?
    private _clientID?: ClientID;
    // private _rentedEntities?: Rentable[];
    private _cameraman?: Cameraman;
    private _equipmentItems?: EquipmentItem[];
    // of wel een propety _period: Period toevoegen
    // dan tijdens het toevoegen van een cameraman en apparatuurItems
    // kijken of de opgegeven periodes daarvan, binnen de periode van de klus vallen

    // ergens moet een check komen dat er altijd OF een cameraman of
    // een apparatuurItem aanwezig moet zijn. Tenminste 1 van de twee.
    constructor(id?: JobID,
                description?: string, 
                location?: string, 
                directedBy?: string, 
                clientID?: ClientID,
                cameraman?: Cameraman,
                equipmentItems: EquipmentItem[] =[]
                /*rentedEntities?: Rentable[]*/) {
        this._id = id;
        this._description = description;
        this._location = location;
        this._directedBy = directedBy;
        this._clientID = clientID;
        this._cameraman = cameraman;
        this._equipmentItems = equipmentItems;
        // this._rentedEntities = rentedEntities;
    }

    public static fromDTO(jobDTO: JobDTO): Job {
        return new Job(
            jobDTO.id,
            jobDTO.description,
            jobDTO.location,
            jobDTO.directedBy,
            jobDTO.clientID,
            // jobDTO.rentedEntities
            jobDTO.cameraman,
            jobDTO.equipmentItems
        );
    }

    public calculateCost(): number {
        let cost: number = 0;

        // if (!isNullOrUndefined(this.cameraman)) {
        //     cost += this.cameraman.calculateCost();
        // }

        // if (!isNullOrUndefined(this.equipmentItems) && this.equipmentItems.length !== 0) {
        //     this.equipmentItems.forEach(item => cost += item.calculateCost());
        // }

        // this.rentedEntities.forEach(e => cost += e.calculateCost());

        return cost;
    }

    public get id(): JobID | undefined {
        return this._id;
    }
    
    public get description(): string | undefined {
        return this._description;
    }

    public get location(): string | undefined {
        return this._location;
    }

    public get directedBy(): string | undefined{
        return this._directedBy;
    }

    public get clientID(): ClientID | undefined {
        return this._clientID;
    }

    // public get rentedEntities(): Rentable[] | undefined {
    //     if (this._rentedEntities !== undefined) {
    //         return this._rentedEntities;
    //     }

    //     return []
    // }

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
    
    public set id(id: JobID | undefined) {
        this._id = id;
    }
    
    public set description(description: string | undefined) {
        if (isNullOrUndefined(description)) {
            throw new Error("Provided description is null or undefined");
        }

        this._description = description;
    }
    
    public set location(location: string | undefined) {
        if (isNullOrUndefined(location)) {
            throw new Error("Provided location is null or undefined");
        }

        this._location = location;
    }
    
    public set directedBy(directedBy: string | undefined) {
        if (isNullOrUndefined(directedBy)) {
            throw new Error("Provided argument for 'directedBy' is null or undefined");
        }

        this._directedBy = directedBy;
    }
    
    public set clientID(clientID: ClientID | undefined) {
        if (isNullOrUndefined(clientID)) {
            throw new Error("Provided clientID is null or undefined");
        }

        this._clientID = clientID;
    }
    
    public set equipmentItems(equipmentItems: EquipmentItem[]) {
        if (isNullOrUndefined(equipmentItems)) {
            this._equipmentItems = [];
        } else {
            this._equipmentItems = equipmentItems;
        }
    }

    public set cameraman(cameraman: Cameraman | undefined) {
        this._cameraman = cameraman;
    }
}