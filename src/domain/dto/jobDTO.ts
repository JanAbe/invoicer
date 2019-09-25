import { ClientID } from "../client/clientID";
import { Cameraman } from "../invoice/job/cameraman";
import { EquipmentItem } from "../invoice/job/equipmentItem";
import { isNullOrUndefined } from "util";
import { JobID } from "../invoice/job/jobID";

export class JobDTO {
    private _id?: JobID;
    private _description?: string;
    private _location?: string;
    private _directedBy?: string;
    private _clientID?: ClientID;
    private _cameraman?: Cameraman;
    private _equipmentItems?: EquipmentItem[] = [];

    constructor() {}

    public get id(): JobID | undefined {
        return this._id;
    }
    
    public get description(): string | undefined {
        return this._description;
    }

    public get location(): string | undefined {
        return this._location;
    }

    public get directedBy(): string | undefined {
        return this._directedBy;
    }

    public get clientID(): ClientID | undefined {
        return this._clientID;
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
    
    public set id(id: JobID | undefined) {
        this._id = id;
    }
    
    public set description(description: string | undefined) {
        this._description = description;
    }
    
    public set location(location: string | undefined) {
        this._location = location;
    }
    
    public set directedBy(directedBy: string | undefined) {
        this._directedBy = directedBy;
    }
    
    public set clientID(clientID: ClientID | undefined) {
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