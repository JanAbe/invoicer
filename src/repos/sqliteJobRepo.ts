import { JobRepo } from "./jobRepo";
import uuid = require("uuid/v4");
import { Job } from "../domain/job";
import { JobID } from "../domain/jobID";

export class SqliteJobRepo implements JobRepo {

    public nextID(): string {
        return uuid();
    }

    public jobOfID(jobID: JobID): Job {
        throw new Error();
    }

    public save(job: Job): void {
        throw new Error();
    }
}