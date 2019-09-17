import { InvoiceID } from "../domain/invoiceID";
import { Invoice } from "../domain/invoice";
import { InvoiceRepo } from "../repos/invoiceRepo";
import { Job } from "../domain/job";
import { JobRepo } from "../repos/jobRepo";
import { ClientRepo } from "../repos/clientRepo";
import { InvoiceDTO } from "../domain/dto/InvoiceDTO";
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
        this._invoiceRepo.save(invoice, job);
    }

    public async fetchInvoiceByID(invoiceID: InvoiceID): Promise<Invoice> {
        return await this._invoiceRepo.invoiceOfID(invoiceID);
    }

    // rename to fetchAllInvoicesAndRenderHTML
        // or split in 2 functions
    // changed return type to string because i couldn't figure out
    // how to use nunjucks in the client-side scripts
    public async fetchAllInvoices(): Promise<string> {
        const invoiceDTOs: InvoiceDTO[] = [];
        const invoices = await this._invoiceRepo.invoices();

        for (const invoice of invoices) {
            const invoiceDTO = new InvoiceDTO();
            invoiceDTO.id = invoice.invoiceID.toString();
            invoiceDTO.invoiceNumber = 'some number';
            invoiceDTO.creationDate = invoice.creationDate;
            await this._jobRepo.jobOfID(invoice.jobID)
                .then(job => {
                    invoiceDTO.jobDescription = job.description;
                    return job.clientID;
                })
                .then(clientID => {
                    return this._clientRepo.clientOfID(clientID!);
                })
                .then(client => {
                    invoiceDTO.clientName = client.fullName.toString();
                })
                .catch(err => {
                    console.log(err);
                });

            invoiceDTOs.push(invoiceDTO);
        }

        nunjucks.configure('src/ui', { autoescape: true });

        return new Promise((resolve, reject) => {
            const html = nunjucks.render('invoice-row-template.html', {
                invoiceDTOs: invoiceDTOs
            });
            resolve(html);
        });
    }

    // todo: remove hardcoded values and write code to support this
    // todo: rename to generateInvoiceHTML?
    // todo: look into used (!) exclamation marks
    // todo: look into best way to store money values
        // atm the number datatype is used.
            // 5964 + 1252.44 = 7216.4400000000005
    public async generateInvoice(invoiceID: InvoiceID): Promise<string> {
        const invoice = await this._invoiceRepo.invoiceOfID(invoiceID);
        const job = await this._jobRepo.jobOfID(invoice.jobID);
        const client = await this._clientRepo.clientOfID(job.clientID!);
        const vatPercentage = 21;

        nunjucks.configure('src/ui', { autoescape: true });
        const html = nunjucks.render('invoice-template.html', 
            { 
                creation_date: invoice.creationDate,
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