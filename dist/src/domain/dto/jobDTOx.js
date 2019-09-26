"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JobDTO {
    constructor(description, location, directedBy, comment, id, cameramanDTO, equipmentItemDTOs, totalCosts, vatCosts, totalCostsWithVAT, clientID) {
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
exports.JobDTO = JobDTO;
//# sourceMappingURL=jobDTOx.js.map