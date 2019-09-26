import { CameramanDTO } from "./cameramanDTO";
import { EquipmentItemDTO } from "./equipmentItemDTO";

export class JobDTO {
    public description?: string;
    public location?: string;
    public directedBy?: string;
    public comment?: string;
    public id?: string;
    public cameramanDTO?: CameramanDTO;
    public equipmentItemDTOs?: EquipmentItemDTO[];
    public totalCosts?: number;
    public vatCosts?: number;
    public totalCostsWithVAT?: number;
    public clientID?: string;

    constructor(
        description?: string,
        location?: string,
        directedBy?: string,
        comment?: string,
        id?: string,
        cameramanDTO?: CameramanDTO,
        equipmentItemDTOs?: EquipmentItemDTO[],
        totalCosts?: number,
        vatCosts?: number,
        totalCostsWithVAT?: number,
        clientID?: string
    ) {
        this.description = description;
        this.location = location;
        this.directedBy = directedBy;
        this.comment = comment;
        this.id = id;
        this.cameramanDTO = cameramanDTO;
        this.equipmentItemDTOs = equipmentItemDTOs;
        this.totalCosts = totalCosts;
        this.vatCosts = vatCosts,
        this.totalCostsWithVAT = totalCostsWithVAT,
        this.clientID = clientID;
    }
}