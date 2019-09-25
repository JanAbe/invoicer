import { Job } from "./job";
import { JobID } from "./jobID";

export interface JobRepo {

    // nextID creates a new JobID to use
    nextID(): JobID;

    // jobOfID fetches a job based on ID
    jobOfID(jobID: JobID): Promise<Job>;

    // save saves a job (returns a promise containing the nr of rows updated or the rowID of the inserted entity)
    save(job: Job): void;
}