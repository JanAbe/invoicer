import { JobRepo } from "../../../domain/job/jobRepo";
import uuid = require("uuid/v4");
import { Job } from "../../../domain/job/job";
import { JobID } from "../../../domain/job/jobID";
import { DB } from "../../../db";
import { ClientID } from "../../../domain/client/clientID";
import { EquipmentItem } from "../../../domain/job/equipmentItem";
import { Period } from "../../../domain/job/period";
import { Cameraman } from "../../../domain/job/cameraman";
import { JobDTO } from "../../../domain/dto/jobDTO";
import { isNullOrUndefined } from "util";
import moment = require("moment");

export class SqliteJobRepo implements JobRepo {
    private _db: DB;

    constructor(db: DB) {
        this._db = db;
    }

    public nextID(): JobID {
        return new JobID(uuid());
    }

    public async jobOfID(jobID: JobID): Promise<Job> {
        const jobDTO = new JobDTO();

        const cameramanQuery = 'SELECT r.start_date, r.end_date, r.day_price, c.firstName, c.lastName FROM Rented_Entity r JOIN Cameraman c ON (r.ref_cameraman = c.id) WHERE r.ref_job = ?;';
        await new Promise((resolve, reject) => {
            this._db.db.get(cameramanQuery, jobID.toString(), function (err, row) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    if (row !== undefined) {
                        const cameraman = new Cameraman(row.firstName, row.lastName, row.day_price, new Period(moment(row.start_date, 'DD/MM/YYYY').toDate(), moment(row.end_date, 'DD/MM/YYYY').toDate()));
                        jobDTO.cameraman = cameraman;
                    }
                    resolve();
                }
            });
        });

        const equipmentItemQuery = 'SELECT r.start_date, r.end_date, r.day_price, e.name from Rented_Entity r JOIN Equipment_Item e ON (r.ref_equipment_item = e.id) WHERE r.ref_job = ?;';
        await new Promise((resolve, reject) => {
            this._db.db.all(equipmentItemQuery, jobID.toString(), function (err, rows) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    if (rows !== undefined) {
                        rows.forEach((row) => {
                            let equipmentItem = new EquipmentItem(row.name, row.day_price, new Period(moment(row.start_date, 'DD/MM/YYYY').toDate(), moment(row.end_date, 'DD/MM/YYYY').toDate()));
                            jobDTO.equipmentItems.push(equipmentItem);
                        });
                    }
                    resolve();
                }
            });
        });

        const jobQuery = 'SELECT id, description, location, directed_by, ref_client FROM Job WHERE id = ?;';
        await new Promise((resolve, reject) => {
            this._db.db.get(jobQuery, jobID.toString(), function (err, row) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    jobDTO.id = new JobID(row.id);
                    jobDTO.directedBy = row.directed_by;
                    jobDTO.description = row.description;
                    jobDTO.location = row.location;
                    jobDTO.clientID = new ClientID(row.ref_client);
                    resolve();
                }
            });
        });

        return new Promise((resolve, reject) => {
          resolve(Job.fromDTO(jobDTO));  
        });
    }

    public async save(job: Job): Promise<void> {
        const jobQuery = 'INSERT INTO Job (id, description, location, directed_by, ref_client) VALUES (?, ?, ?, ?, ?);';
        this._db.run(jobQuery, [
            job.id!.toString(),
            job.description,
            job.location,
            job.directedBy,
            job.clientID!.toString()
        ]);

        const rentedEntityQuery = 'INSERT INTO Rented_Entity (id, start_date, end_date, day_price, ref_job, ref_cameraman, ref_equipment_item) VALUES (?, ?, ?, ?, ?, ?, ?);';
        
        if (!isNullOrUndefined(job.cameraman)) {
            const cameramanQuery = 'INSERT INTO Cameraman (id, firstName, lastName) VALUES (?, ?, ?);';
            const cameramanID = uuid();
            await this._db.run(cameramanQuery, [
                cameramanID,
                job.cameraman.firstName,
                job.cameraman.lastName
            ]);

            const rentedEntityID = uuid();
            await this._db.run(rentedEntityQuery, [
                rentedEntityID,
                job.cameraman.period.startDate.toLocaleDateString('nl'),
                job.cameraman.period.endDate.toLocaleDateString('nl'),
                job.cameraman.dayPrice,
                job.id!.toString(),
                cameramanID,
                null
            ]);
        }

        const equipmentItemQuery = 'INSERT INTO Equipment_Item (id, name) VALUES (?, ?);';
        let equipmentItemID: string;
        let rentedEntityID: string;
        for (const e of job.equipmentItems) {
            equipmentItemID = uuid();
            await this._db.run(equipmentItemQuery, [
                equipmentItemID,
                e.name
            ]);

            rentedEntityID = uuid();
            await this._db.run(rentedEntityQuery, [
                rentedEntityID,
                e.period.startDate.toLocaleDateString('nl'),
                e.period.endDate.toLocaleDateString('nl'),
                e.dayPrice,
                job.id!.toString(),
                null,
                equipmentItemID
            ]);
        }
    }
}