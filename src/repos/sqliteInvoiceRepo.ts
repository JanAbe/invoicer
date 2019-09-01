import { InvoiceRepo } from "./invoiceRepo";
import { InvoiceID } from "../domain/invoiceID";
import { Invoice } from "../domain/invoice";
import { JobRepo } from "./jobRepo";
import uuid = require("uuid/v4");
import { DB } from "../db";
import { JobID } from "../domain/jobID";

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

    public invoices(): Invoice[] {
        return [];
    }

    public invoiceOfID(invoiceID: InvoiceID): Promise<Invoice> {
        // let invoice: any;

        const query = 'SELECT id, creation_date, iban, ref_job FROM Invoice WHERE id=?'; 
        return this._db.get(query, [invoiceID.toString()]);
        // this._db.db.get(query, invoiceID.toString(), (err, row) => {
        //     if (err) {
        //         console.log(err);
        //         invoice = null;
        //     } else {
        //         invoice = new Invoice(new InvoiceID(row.id), 
        //                               new JobID(row.ref_job), 
        //                               row.iban, 
        //                               row.creation_date);
        //     }
        // }); 

        // return invoice;
    }

    public save(invoice: Invoice): void {
        // to save an invoice, the job of the invoice must also
        // be saved. Therefore the JobRepo is necessary
        throw new Error();
    }
    
}