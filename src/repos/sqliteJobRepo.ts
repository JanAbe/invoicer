import { JobRepo } from "./jobRepo";
import uuid = require("uuid/v4");
import { Job } from "../domain/job";
import { JobID } from "../domain/jobID";
import { DB } from "../db";

export class SqliteJobRepo implements JobRepo {
    private _db: DB;

    constructor(db: DB) {
        this._db = db;
    }

    public nextID(): JobID {
        return new JobID(uuid());
    }

    public jobOfID(jobID: JobID): Job {
        throw new Error();
    }

    public save(job: Job): Promise<any> {
        const query = 'INSERT INTO Client (id, firstName, lastName, email, city, street, houseNumber, zipcode) VALUES (?, ?, ?, ?, ?, ?, ?, ?);';
        return this._db.run(query, [job.id.toString(), 
                job.client.fullName.firstName,
                job.client.fullName.lastName,
                job.client.email.emailAddress,
                job.client.address.city,
                job.client.address.street,
                job.client.address.houseNumber,
                job.client.address.zipcode]);
    }
}