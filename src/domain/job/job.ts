import { JobID } from "./jobID";
import { isNullOrUndefined } from "util";
import { Cameraman } from "./cameraman";
import { EquipmentItem } from "./equipmentItem";
import { ClientID } from "../client/clientID";
import { JobDTO } from "../dto/jobDTO";
import ezmoney = require('ezmoney');
import { isEmpty } from "../../util/helpers";

export class Job {
    private _id?: JobID;
    private _description?: string;
    private _location?: string;
    private _directedBy?: string;
    private _clientID?: ClientID;
    private _cameraman?: Cameraman;
    private _equipmentItems?: EquipmentItem[];
    private _comment?: string; // todo: add code for comment in this class and others

    constructor(id?: JobID,
                description?: string, 
                location?: string, 
                directedBy?: string, 
                clientID?: ClientID,
                cameraman?: Cameraman,
                equipmentItems: EquipmentItem[] =[],
                comment?: string) {
        this._id = id;
        this._description = description;
        this._location = location;
        this._directedBy = directedBy;
        this._clientID = clientID;
        this._cameraman = cameraman;
        this._equipmentItems = equipmentItems;
        this._comment = comment;
    }

    public static fromDTO(jobDTO: JobDTO): Job {
        return new Job(
            jobDTO.id,
            jobDTO.description,
            jobDTO.location,
            jobDTO.directedBy,
            jobDTO.clientID,
            jobDTO.cameraman,
            jobDTO.equipmentItems
        );
    }

    /**
     * Calculate the total amount of money that needs to be paid, by combining
     * the costs of renting equipment items and cameraman, and the amount of VAT
     * that needs to be paid.
     * @param costs the costs of the rented out equipment and cameraman
     * @param vatCosts the costs that needs to be paid because of VAT
     */
    public calculateCostsIncludingVAT(costs: number, vatCosts: number): number {
        const costsEUR = ezmoney.fromNumber(costs, 'EUR', 2);
        const vatCostsEUR = ezmoney.fromNumber(vatCosts, 'EUR', 2);
        const total = ezmoney.add(costsEUR, vatCostsEUR);
        return ezmoney.toNumber(total);
    }
    
    /**
     * Calculates the amount of money that needs to be paid because of VAT
     * @param costs the costs of the rented out equipment and cameraman
     * @param vatPercentage the percentage of VAT that needs to be paid
     */
    public calculateVATCosts(costs: number, vatPercentage: number): number {
        const costsEUR = ezmoney.fromNumber(costs, 'EUR', 2, ezmoney.roundUp);
        const vatCosts = ezmoney.multiply(costsEUR, vatPercentage, 2, ezmoney.roundUp);

        return ezmoney.toNumber(
            ezmoney.divide(vatCosts, 100, 2, ezmoney.roundUp)
        );
    }

    /**
     * Calculates the amount of money that needs to be paid based on
     * which equipmentItems and cameraman were rented out.
     */
    public calculateCost(): number {
        let costs = ezmoney.fromNumber(0, 'EUR', 2, ezmoney.roundUp);

        if (!isNullOrUndefined(this.cameraman)) {
            const cameramanCosts = ezmoney.fromNumber(this.cameraman.calculateCost(), 'EUR', 2, ezmoney.roundUp);
            costs = ezmoney.add(costs, cameramanCosts);
        }
        
        if (!isNullOrUndefined(this.equipmentItems) && this.equipmentItems.length !== 0) {
            this.equipmentItems.forEach(item => {
                const equipmentItemCosts = ezmoney.fromNumber(item.calculateCost(), 'EUR', 2, ezmoney.roundUp);
                costs = ezmoney.add(costs, equipmentItemCosts);
            });
        }
        
        return ezmoney.toNumber(costs);
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

    public get comment(): string | undefined {
        return this._comment;
    }
    
    public set id(id: JobID | undefined) {
        this._id = id;
    }
    
    public set description(description: string | undefined) {
        if (isNullOrUndefined(description)) {
            throw new Error("Provided description is null or undefined");
        }

        if (isEmpty(description)) {
            throw new Error("Provided description is empty");
        }

        this._description = description;
    }
    
    public set location(location: string | undefined) {
        if (isNullOrUndefined(location)) {
            throw new Error("Provided location is null or undefined");
        }

        if (isEmpty(location)) {
            throw new Error("Provided location is empty");
        }

        this._location = location;
    }
    
    public set directedBy(directedBy: string | undefined) {
        if (isNullOrUndefined(directedBy)) {
            throw new Error("Provided argument for 'directedBy' is null or undefined");
        }

        if (isEmpty(directedBy)) {
            throw new Error("Provided directedBy is empty");
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

    public set comment(comment: string | undefined) {
        if (isNullOrUndefined(comment)) {
            throw new Error("Provided comment is null or undefined");
        }

        this._comment = comment;
    }
}