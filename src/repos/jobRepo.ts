import { Job } from "../domain/job";
import { JobID } from "../domain/jobID";

export interface JobRepo {

    // nextID creates a new JobID to use
    nextID(): JobID;

    // jobOfID fetches a job based on ID
    jobOfID(jobID: JobID): Job;

    // save saves a job
    save(job: Job): void;
}