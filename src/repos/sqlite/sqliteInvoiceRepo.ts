import { InvoiceRepo } from "../invoiceRepo";
import { InvoiceID } from "../../domain/invoiceID";
import { Invoice } from "../../domain/invoice";
import { JobRepo } from "../jobRepo";
import { DB } from "../../db";
import { JobID } from "../../domain/jobID";
import { Job } from "../../domain/job";
import uuid = require("uuid/v4");
import moment from "moment";

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
    public async invoices(): Promise<Invoice[]> {
        const query: string = 'SELECT id from Invoice;';
        let invoices: Invoice[] = [];
        let invoicdeIDs: InvoiceID[] = [];

        /* 
            why doesn't this work?
            await this._db.all(query)
            .then(rows => {
                rows.forEach(row => {
                    this.invoiceOfID(new InvoiceID(row.id))
                    .then(invoice => {
                        invoices.push(invoice);
                        console.log(invoices);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                });
            })
            .catch(err => {
                console.log(err);
            });

            const rows = await this._db.all(query);
            rows.forEach(row => {
                invoicdeIDs.push(new InvoiceID(row.id));
            });

            why doesn't this work?
            invoicdeIDs.forEach(async id => {
                const invoice = await this.invoiceOfID(id);
                invoices.push(invoice);
            }); 
        */

        const rows = await this._db.all(query);
        rows.forEach(row => {
            invoicdeIDs.push(new InvoiceID(row.id));
        });

        for (let id of invoicdeIDs) {
            const invoice = await this.invoiceOfID(id);
            invoices.push(invoice);
        }

        return new Promise((resolve, reject) => {
            resolve(invoices);
        });
    }

    public async invoiceOfID(invoiceID: InvoiceID): Promise<Invoice> {
        const query = 'SELECT id, creation_date, iban, ref_job FROM Invoice WHERE id=?'; 

        // how does this work?
        // how is this a promise? it was suggested by vscode to change it into this
        const row = await this._db.get(query, [invoiceID.toString()]);
        return new Invoice(new InvoiceID(row.id), new JobID(row.ref_job), row.iban, moment(row.creation_date, 'DD/MM/YYYY').toDate());
    }

    public save(invoice: Invoice, job: Job): void {
        this._jobRepo.save(job);
        const invoiceQuery = 'INSERT INTO Invoice (id, iban, creation_date, ref_job) VALUES (?, ?, ?, ?);';
        this._db.run(invoiceQuery, [
            invoice.invoiceID.toString(),
            invoice.iban,
            invoice.creationDate.toLocaleDateString('nl'),
            invoice.jobID.toString()
        ]);
    }
}