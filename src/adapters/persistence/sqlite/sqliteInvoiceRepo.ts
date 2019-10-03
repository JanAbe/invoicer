import { InvoiceRepo } from "../../../domain/invoice/invoiceRepo";
import { InvoiceID } from "../../../domain/invoice/invoiceID";
import { Invoice } from "../../../domain/invoice/invoice";
import { JobRepo } from "../../../domain/job/jobRepo";
import { DB } from "../../../db";
import { JobID } from "../../../domain/job/jobID";
import { Job } from "../../../domain/job/job";
import uuid = require("uuid/v4");
import moment from "moment";
import { Client } from "../../../domain/client/client";

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
        const query: string = 'SELECT id FROM Invoice ORDER BY invoice_number DESC;';
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
        const row = await this._db.get(query, [invoiceID.toString()]);

        if (row === undefined) {
            throw new Error(`Invoice not found. There is no invoice with id: ${invoiceID.toString()}`);
        }

        return new Invoice(new InvoiceID(row.id), row.invoice_number, new JobID(row.ref_job), row.iban, moment(row.creation_date, 'DD/MM/YYYY').toDate());
    }

    public async save(invoice: Invoice, job: Job): Promise<void> {
        this._jobRepo.save(job);
        const invoiceQuery = 'INSERT INTO Invoice (id, invoice_number, iban, creation_date, ref_job) VALUES (?, ?, ?, ?, ?);';
        await this._db.run(invoiceQuery, [
            invoice.invoiceID.toString(),
            invoice.invoiceNumber,
            invoice.iban,
            invoice.creationDate.toLocaleString('nl'),
            invoice.jobID.toString()
        ]);
    }

    public async delete(invoiceID: InvoiceID): Promise<void> {
        const jobIDQuery = 'SELECT ref_job FROM Invoice WHERE id = ?;';
        const row = await this._db.get(jobIDQuery, [invoiceID.toString()]);
        if (row === undefined) {
            throw new Error(`No invoice with id: ${invoiceID.toString()}`);
        }
        const deleteQuery = 'DELETE FROM Job WHERE id = ?;';
        await this._db.run(deleteQuery, [row.ref_job]);
    }

    public async update(invoiceID: InvoiceID, invoice: Invoice, job: Job, client: Client) {
        const updateClientQuery = 'UPDATE Client SET firstName=?, lastName=?, email=?, city=?, street=?, houseNumber=?, zipcode=? WHERE id=?;';
        await this._db.run(updateClientQuery, [
            client.fullName.firstName,
            client.fullName.lastName,
            client.email.emailAddress,
            client.address.city,
            client.address.street,
            client.address.houseNumber,
            client.address.zipcode,
            client.id.toString()
        ]);

        // await this.delete(invoiceID);
        await this.save(invoice, job);
    }
}