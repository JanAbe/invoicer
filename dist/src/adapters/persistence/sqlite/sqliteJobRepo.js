"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid = require("uuid/v4");
const job_1 = require("../../../domain/job/job");
const jobID_1 = require("../../../domain/job/jobID");
const clientID_1 = require("../../../domain/client/clientID");
const equipmentItem_1 = require("../../../domain/job/equipmentItem");
const period_1 = require("../../../domain/job/period");
const cameraman_1 = require("../../../domain/job/cameraman");
const jobDTO_1 = require("../../../domain/dto/jobDTO");
const util_1 = require("util");
const moment = require("moment");
class SqliteJobRepo {
    constructor(db) {
        this._db = db;
    }
    nextID() {
        return new jobID_1.JobID(uuid());
    }
    jobOfID(jobID) {
        return __awaiter(this, void 0, void 0, function* () {
            const jobDTO = new jobDTO_1.JobDTO();
            const cameramanQuery = 'SELECT r.start_date, r.end_date, r.day_price, c.firstName, c.lastName FROM Rented_Entity r JOIN Cameraman c ON (r.ref_cameraman = c.id) WHERE r.ref_job = ?;';
            yield new Promise((resolve, reject) => {
                this._db.db.get(cameramanQuery, jobID.toString(), function (err, row) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else {
                        if (row !== undefined) {
                            const cameraman = new cameraman_1.Cameraman(row.firstName, row.lastName, row.day_price, new period_1.Period(moment(row.start_date, 'DD/MM/YYYY').toDate(), moment(row.end_date, 'DD/MM/YYYY').toDate()));
                            jobDTO.cameraman = cameraman;
                        }
                        resolve();
                    }
                });
            });
            const equipmentItemQuery = 'SELECT r.start_date, r.end_date, r.day_price, e.name from Rented_Entity r JOIN Equipment_Item e ON (r.ref_equipment_item = e.id) WHERE r.ref_job = ?;';
            yield new Promise((resolve, reject) => {
                this._db.db.all(equipmentItemQuery, jobID.toString(), function (err, rows) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else {
                        if (rows !== undefined) {
                            rows.forEach((row) => {
                                let equipmentItem = new equipmentItem_1.EquipmentItem(row.name, row.day_price, new period_1.Period(moment(row.start_date, 'DD/MM/YYYY').toDate(), moment(row.end_date, 'DD/MM/YYYY').toDate()));
                                jobDTO.equipmentItems.push(equipmentItem);
                            });
                        }
                        resolve();
                    }
                });
            });
            const jobQuery = 'SELECT id, description, location, directed_by, ref_client FROM Job WHERE id = ?;';
            yield new Promise((resolve, reject) => {
                this._db.db.get(jobQuery, jobID.toString(), function (err, row) {
                    if (err) {
                        console.log(err);
                        reject(err);
                    }
                    else {
                        jobDTO.id = new jobID_1.JobID(row.id);
                        jobDTO.directedBy = row.directed_by;
                        jobDTO.description = row.description;
                        jobDTO.location = row.location;
                        jobDTO.clientID = new clientID_1.ClientID(row.ref_client);
                        resolve();
                    }
                });
            });
            return new Promise((resolve, reject) => {
                resolve(job_1.Job.fromDTO(jobDTO));
            });
        });
    }
    save(job) {
        const jobQuery = 'INSERT INTO Job (id, description, location, directed_by, ref_client) VALUES (?, ?, ?, ?, ?);';
        this._db.run(jobQuery, [
            job.id.toString(),
            job.description,
            job.location,
            job.directedBy,
            job.clientID.toString()
        ]);
        const rentedEntityQuery = 'INSERT INTO Rented_Entity (id, start_date, end_date, day_price, ref_job, ref_cameraman, ref_equipment_item) VALUES (?, ?, ?, ?, ?, ?, ?);';
        if (!util_1.isNullOrUndefined(job.cameraman)) {
            const cameramanQuery = 'INSERT INTO Cameraman (id, firstName, lastName) VALUES (?, ?, ?);';
            const cameramanID = uuid();
            this._db.run(cameramanQuery, [
                cameramanID,
                job.cameraman.firstName,
                job.cameraman.lastName
            ]);
            const rentedEntityID = uuid();
            this._db.run(rentedEntityQuery, [
                rentedEntityID,
                job.cameraman.period.startDate.toLocaleDateString('nl'),
                job.cameraman.period.endDate.toLocaleDateString('nl'),
                job.cameraman.dayPrice,
                job.id.toString(),
                cameramanID,
                null
            ]);
        }
        const equipmentItemQuery = 'INSERT INTO Equipment_Item (id, name) VALUES (?, ?);';
        let equipmentItemID;
        let rentedEntityID;
        job.equipmentItems.forEach(e => {
            equipmentItemID = uuid();
            this._db.run(equipmentItemQuery, [
                equipmentItemID,
                e.name
            ]);
            rentedEntityID = uuid();
            this._db.run(rentedEntityQuery, [
                rentedEntityID,
                e.period.startDate.toLocaleDateString('nl'),
                e.period.endDate.toLocaleDateString('nl'),
                e.dayPrice,
                job.id.toString(),
                null,
                equipmentItemID
            ]);
        });
    }
}
exports.SqliteJobRepo = SqliteJobRepo;
//# sourceMappingURL=sqliteJobRepo.js.map