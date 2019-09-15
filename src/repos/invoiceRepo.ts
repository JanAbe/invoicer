import { InvoiceID } from "../domain/invoiceID";
import { Invoice } from "../domain/invoice";
import { Job } from "../domain/job";

export interface InvoiceRepo {

    // nextID creates a new InvoiceID to use
    nextID(): InvoiceID;

    // TODO: think about a way that is better for performance than to fetch 'em all. Maybe work with observables or something?
    // invoices fetches all invoices in the database
    invoices(): Promise<Invoice[]>;

    // invoiceOfID fetches an invoice based on ID
    invoiceOfID(invoiceID: InvoiceID): Promise<Invoice>;

    // save saves an invoice
    save(invoice: Invoice, job: Job): void;
}