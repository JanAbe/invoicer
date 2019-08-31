import { InvoiceID } from "../domain/invoiceID";
import { Invoice } from "../domain/invoice";

export interface InvoiceRepo {

    // nextID creates a new InvoiceID to use
    nextID(): InvoiceID;

    // TODO: think about a way that is better for performance than to fetch 'em all.
    // invoices fetches all invoices in the database
    invoices(): Invoice[];

    // invoiceOfID fetches an invoice based on ID
    invoiceOfID(invoiceID: InvoiceID): Invoice;

    // save saves an invoice
    save(invoice: Invoice): void;
}