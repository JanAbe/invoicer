import { InvoiceRepo } from "../../../domain/invoice/invoiceRepo";
import { InvoiceID } from "../../../domain/invoice/invoiceID";
import { Invoice } from "../../../domain/invoice/invoice";
import { JobRepo } from "../../../domain/invoice/job/jobRepo";
import { DB } from "../../../db";
import { JobID } from "../../../domain/invoice/job/jobID";
import { Job } from "../../../domain/invoice/job/job";
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

    public async nextInvoiceNumber(date: Date): Promise<string> {
        let nextInvoiceNumber = '';
        const year = date.getFullYear().toString();
        const nrOfInvoicesCurrentYearQuery = `SELECT Count(*) as nr FROM Invoice WHERE creation_date LIKE '%${year}%';`;
        const row = await this._db.get(nrOfInvoicesCurrentYearQuery);

        if (row === undefined) {
            return nextInvoiceNumber;
        }

        return Invoice.generateInvoiceNumber(row.nr, date);
    }

    public async invoices(): Promise<Invoice[]> {
        const query: string = 'SELECT id from Invoice;';
        let invoices: Invoice[] = [];
        let invoicdeIDs: InvoiceID[] = [];

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
        const query = 'SELECT id, creation_date, invoice_number, iban, ref_job FROM Invoice WHERE id=?'; 

        // how does this work?
        // how is this a promise? it was suggested by vscode to change it into this
        const row = await this._db.get(query, [invoiceID.toString()]);
        return new Invoice(new InvoiceID(row.id), row.invoice_number, new JobID(row.ref_job), row.iban, moment(row.creation_date, 'DD/MM/YYYY').toDate());
    }

    public save(invoice: Invoice, job: Job): void {
        this._jobRepo.save(job);
        const invoiceQuery = 'INSERT INTO Invoice (id, invoice_number, iban, creation_date, ref_job) VALUES (?, ?, ?, ?, ?);';
        this._db.run(invoiceQuery, [
            invoice.invoiceID.toString(),
            invoice.invoiceNumber,
            invoice.iban,
            invoice.creationDate.toLocaleString('nl'),
            invoice.jobID.toString()
        ]);
    }
}