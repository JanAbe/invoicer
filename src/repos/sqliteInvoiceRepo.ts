import { InvoiceRepo } from "./invoiceRepo";
import { InvoiceID } from "../domain/invoiceID";
import { Invoice } from "../domain/invoice";
import { JobRepo } from "./jobRepo";
import uuid = require("uuid/v4");

export class SqliteInvoiceRepo implements InvoiceRepo {
    private _jobRepo: JobRepo;

    constructor(jobRepo: JobRepo) {
        this._jobRepo = jobRepo;
    }

    public nextID(): string {
        return uuid();
    }

    public invoices(): Invoice[] {
        return [];
    }

    public invoiceOfID(invoiceOfID: InvoiceID): Invoice {
        throw new Error();
    }

    public save(invoice: Invoice): void {
        // to save an invoice, the job of the invoice must also
        // be saved. Therefore the JobRepo is necessary
        throw new Error();
    }
    
}