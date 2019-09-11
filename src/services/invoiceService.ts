import { InvoiceID } from "../domain/invoiceID";
import { Invoice } from "../domain/invoice";
import { InvoiceRepo } from "../repos/invoiceRepo";
import { Job } from "../domain/job";
import { JobRepo } from "../repos/jobRepo";
import { ClientRepo } from "../repos/clientRepo";
import nunjucks = require('nunjucks');

// InvoiceService contains all services a user can call regarding invoices
export class InvoiceService {
    private _invoiceRepo: InvoiceRepo;
    private _jobRepo: JobRepo;
    private _clientRepo: ClientRepo;

    constructor(invoiceRepo: InvoiceRepo, jobRepo: JobRepo, clientRepo: ClientRepo) {
        this._invoiceRepo = invoiceRepo;
        this._jobRepo = jobRepo;
        this._clientRepo = clientRepo;
    }

    public createInvoice(invoice: Invoice, job: Job): void {
        // creates an invoice and stores it in the database
        this._invoiceRepo.save(invoice, job);
    }

    // todo: implement this method / check if it works
    public fetchInvoiceByID(invoiceID: InvoiceID): Invoice {
        this._invoiceRepo.invoiceOfID(invoiceID);
        throw new Error("Not implemented yet");
    }

    // todo: implement this method / check if it works
    public fetchAllInvoices(): Invoice[] {
        this._invoiceRepo.invoices();
        throw new Error("Not implemented yet");
    }

    public async generatePDF(invoiceID: InvoiceID): Promise<string> {
        /*
        fetch invoice with id=invoiceID from database 
        create a pdf with all the necessary information 
            (gotten from the fetched invoice)
        store the pdf in the location chosen by the user
            (e.g. /home/user/Documents/invoices/)
        */
        const invoice = await this._invoiceRepo.invoiceOfID(invoiceID);
        const job = await this._jobRepo.jobOfID(invoice.jobID);
        const client = await this._clientRepo.clientOfID(job.clientID!);
        const vatPercentage = 21;

        nunjucks.configure('src/ui', { autoescape: true });
        const html = nunjucks.render('invoice-template.html', 
            { 
                creation_date: new Date(invoice.creationDate).toLocaleDateString(),
                client_name: client.fullName.firstName + ' ' + client.fullName.lastName,
                street: client.address.street,
                house_number: client.address.houseNumber,
                zipcode: client.address.zipcode,
                city: client.address.city,
                invoice_nr: '2019A32', // temp hardcoded value
                contact_person: client.fullName.firstName + ' ' + client.fullName.lastName,
                project_nr: '823929', // temp hardcoded value
                job_descr: job.description,
                directed_by: job.directedBy,
                location: job.location,
                cameraman: job.cameraman,
                equipment_items: job.equipmentItems,
                vat_percentage: vatPercentage,
                iban: invoice.iban
            });

        return html;
    }

}