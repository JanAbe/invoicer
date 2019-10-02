import { InvoiceID } from "./invoiceID";
import { Invoice } from "./invoice";
import { Job } from "../job/job";

export interface InvoiceRepo {

    /**
     * nextID creates a new InvoiceID to use
     */ 
    nextID(): InvoiceID;

    /**
     * nextInvoiceNumber creates an InvoiceNumber based on the previous one and the given date, thus returning the next one in line
     * @param date 
     */
    nextInvoiceNumber(date: Date): Promise<string>;

    invoices(): Promise<Invoice[]>;

    /**
     * invoiceOfID fetches an invoice based on ID
     * @param invoiceID 
     */
    invoiceOfID(invoiceID: InvoiceID): Promise<Invoice>;

    /**
     * save an invoice 
     * @param invoice 
     * @param job 
     */
    save(invoice: Invoice, job: Job): void;

    /**
     * delete an invoice
     * @param invoiceID id of the invoice to delete
     */
    delete(invoiceID: InvoiceID): void;
}