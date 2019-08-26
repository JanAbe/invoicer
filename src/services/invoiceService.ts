import { InvoiceID } from "../domain/invoiceID";
import { Invoice } from "../domain/invoice";
import { InvoiceRepo } from "../repos/invoiceRepo";

// InvoiceService contains all services a user can call regarding invoices
export class InvoiceService {
    private _invoiceRepo: InvoiceRepo;

    constructor(invoiceRepo: InvoiceRepo) {
        this._invoiceRepo = invoiceRepo;
    }

    public createInvoice(invoice: Invoice): void {
        // creates an invoice and stores it in the database
        this._invoiceRepo.save(invoice);
        throw new Error("Not implemented yet");
    }

    public fetchInvoiceByID(invoiceID: InvoiceID): Invoice {
        this._invoiceRepo.invoiceOfID(invoiceID);
        throw new Error("Not implemented yet");
    }

    public fetchAllInvoices(): Invoice[] {
        this._invoiceRepo.invoices();
        throw new Error("Not implemented yet");
    }

    public generatePDF(invoiceID: InvoiceID): void {
        /*
        fetch invoice with id=invoiceID from database 
        create a pdf with all the necessary information 
            (gotten from the fetched invoice)
        store the pdf in the location chosen by the user
            (e.g. /home/user/Documents/invoices/)
        */
        throw new Error("Not implemented yet");
    }

}