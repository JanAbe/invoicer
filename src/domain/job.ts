import { Period } from "./period";
import { JobID } from "./jobID";
import { isNullOrUndefined } from "util";
import { ClientID } from "./clientID";

export class Job {
    private _id: JobID;
    private _description: string;
    private _location: string;
    private _directedBy: string; // wat is regie in het engels?
    private _clientID: ClientID;

    constructor(id: JobID,
                description: string, 
                location: string, 
                directedBy: string, 
                clientID: ClientID) {
        this._id = id;
        this._description = description;
        this._location = location;
        this._directedBy = directedBy;
        this._clientID = clientID;
    }

    public calculateCost(): number {
        // const days = this.period.getDays();
        // return days * this.dailyWage;
        return -1;
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
    
    // public set dailyWage(dailyWage: number) {
    //     const MINIMUM_DAILY_WAGE = 0;

    //     if (isNullOrUndefined(dailyWage)) {
    //         throw new Error("Provided dailyWage is null or undefined");
    //     }

    //     if (dailyWage < MINIMUM_DAILY_WAGE) {
    //         throw new Error("Provided dailyWage is lower than the minimum possible daily wage (0)")
    //     }

    //     this._dailyWage = dailyWage;
    // }
    
    public set directedBy(directedBy: string) {
        if (isNullOrUndefined(directedBy)) {
            throw new Error("Provided argument for 'directedBy' is null or undefined");
        }

        this._directedBy = directedBy;
    }
    
    // public set period(period: Period) {
    //     if (isNullOrUndefined(period)) {
    //         throw new Error("Provided period is null or undefined");
    //     }

    //     this._period = period;
    // }
    
    public set clientID(clientID: ClientID) {
        if (isNullOrUndefined(clientID)) {
            throw new Error("Provided clientID is null or undefined");
        }

        this._clientID = clientID;
    }
    
}