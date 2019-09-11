import { InvoiceRepo } from "./invoiceRepo";
import { InvoiceID } from "../domain/invoiceID";
import { Invoice } from "../domain/invoice";
import { JobRepo } from "./jobRepo";
import uuid = require("uuid/v4");
import { DB } from "../db";
import { JobID } from "../domain/jobID";
import { Job } from "../domain/job";

export class SqliteInvoiceRepo implements InvoiceRepo {
    private _db: DB;
    private _jobRepo: JobRepo;

    constructor(db: DB, jobRepo: JobRepo) {
        this._db = db;
        this._jobRepo = jobRepo;
    }

    public nextID(): InvoiceID {
        return new InvoiceID(uuid());
    }

    // todo: implement this method
    public invoices(): Invoice[] {
        return [];
    }

    public async invoiceOfID(invoiceID: InvoiceID): Promise<Invoice> {
        const query = 'SELECT id, creation_date, iban, ref_job FROM Invoice WHERE id=?'; 

        // how does this work?
        // how is this a promise? it was suggested by vscode to change it into this
        const row = await this._db.get(query, [invoiceID.toString()]);
        return new Invoice(new InvoiceID(row.id), new JobID(row.ref_job), row.iban, row.creation_date);
    }

    public save(invoice: Invoice, job: Job): void {
        this._jobRepo.save(job);
        const invoiceQuery = 'INSERT INTO Invoice (id, iban, creation_date, ref_job) VALUES (?, ?, ?, ?);';
        this._db.run(invoiceQuery, [
            invoice.invoiceID.toString(),
            invoice.iban,
            invoice.creationDate.toISOString(),
            invoice.jobID.toString()
        ]);
    }
}