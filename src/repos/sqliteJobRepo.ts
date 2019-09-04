import { JobRepo } from "./jobRepo";
import uuid = require("uuid/v4");
import { Job } from "../domain/job";
import { JobID } from "../domain/jobID";
import { DB } from "../db";
import { ClientID } from "../domain/clientID";
import { EquipmentItem } from "../domain/equipmentItem";
import { Period } from "../domain/period";
import { Cameraman } from "../domain/cameraman";
import { JobDTO } from "../domain/jobDTO";

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
                    const cameraman = new Cameraman(row.firstName + ' ' + row.lastName, row.day_price, new Period(new Date(row.start_date), new Date(row.end_date)));
                    jobDTO.rentedEntities.push(cameraman);
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
                    rows.forEach((row) => {
                        let equipmentItem = new EquipmentItem(row.name, row.day_price, new Period(new Date(row.start_date), new Date(row.end_date)));
                        jobDTO.rentedEntities.push(equipmentItem);
                    });
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

    public save(job: Job): Promise<any> {
        throw new Error();
    }
}