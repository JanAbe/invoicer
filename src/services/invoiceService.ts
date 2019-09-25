import { InvoiceID } from "../domain/invoice/invoiceID";
import { Invoice } from "../domain/invoice/invoice";
import { InvoiceRepo } from "../domain/invoice/invoiceRepo";
import { Job } from "../domain/invoice/job/job";
import { JobRepo } from "../domain/invoice/job/jobRepo";
import { ClientRepo } from "../domain/client/clientRepo";
import { InvoiceDTO } from "../domain/dto/InvoiceDTO";
import { UserRepo } from "../repos/userRepo";
import nunjucks = require('nunjucks');
import { Client } from "../domain/client/client";
import { FullName } from "../domain/client/fullName";
import { Email } from "../domain/client/email";
import { Address } from "../domain/client/address";
import { Cameraman } from "../domain/invoice/job/cameraman";
import { Period } from "../domain/invoice/job/period";
import { EquipmentItem } from "../domain/invoice/job/equipmentItem";

// InvoiceService contains all services a user can call regarding invoices
export class InvoiceService {
    private _invoiceRepo: InvoiceRepo;
    private _jobRepo: JobRepo;
    private _clientRepo: ClientRepo;
    private _userRepo: UserRepo;

    constructor(invoiceRepo: InvoiceRepo, jobRepo: JobRepo, clientRepo: ClientRepo, userRepo: UserRepo) {
        this._invoiceRepo = invoiceRepo;
        this._jobRepo = jobRepo;
        this._clientRepo = clientRepo;
        this._userRepo = userRepo;
    }

    // or expect only an invoiceDTO?
    public createInvoice(invoiceProps: any) {
        const { iban, client, job, cameraman, equipmentItems } = invoiceProps; 
        const { clientFirstName, clientLastName, email, city, street, zipcode, houseNumber } = client;
        const { description, location, directedBy } = job;
        
        const clientID = this._clientRepo.nextID();
        const newClient = new Client(
            clientID,
            new FullName(clientFirstName, clientLastName), 
            new Email(email), 
            new Address(city, street, houseNumber, zipcode)
        );

        let newCameraman: Cameraman;
        if (cameraman !== undefined) {
            const { firstName, lastName, dayPrice, startDate, endDate } = cameraman; 
            newCameraman = new Cameraman(
                firstName,
                lastName,
                dayPrice,
                new Period(
                    new Date(startDate), 
                    new Date(endDate))
            )
        }

        let newEquipmentItems: EquipmentItem[] = [];
        if (equipmentItems !== undefined) {
            equipmentItems.forEach((e: any) => {
                const { equipmentItemName, equipmentItemDayPrice, equipmentItemStartDate, equipmentItemEndDate } = e; 
                newEquipmentItems.push(
                    new EquipmentItem(
                        equipmentItemName,
                        equipmentItemDayPrice,
                        new Period(
                            new Date(equipmentItemStartDate), 
                            new Date(equipmentItemEndDate))
                    )
                );
            });
        }
        
        const jobID = this._jobRepo.nextID();
        const newJob = new Job(
            jobID,
            description, 
            location, 
            directedBy,
            clientID,
            newCameraman!,
            newEquipmentItems
        )

        const newInvoice = new Invoice(
            this._invoiceRepo.nextID(),
            jobID,
            iban
        )
        
        this._clientRepo.save(newClient);
        this._invoiceRepo.save(newInvoice, newJob);
        // todo: look into dependencies (dependency flow)
    }

    public async fetchInvoiceByID(invoiceID: string): Promise<Invoice> {
        return await this._invoiceRepo.invoiceOfID(new InvoiceID(invoiceID));
    }

    // rename to fetchAllInvoicesAndRenderHTML
        // or split in 2 functions
        // because atm it is tightly coupled with html and nunjucks
        // what if i want to send back a json representation or something
        // need to add a new adapter class that does stuff with html
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
    public async generateInvoice(invoiceID: string, userID: string): Promise<string> {
        const invoice = await this._invoiceRepo.invoiceOfID(new InvoiceID(invoiceID));
        const job = await this._jobRepo.jobOfID(invoice.jobID);
        const client = await this._clientRepo.clientOfID(job.clientID!);
        const user = await this._userRepo.userOfID(userID);
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
                project_nr: 'n.v.t', // temp hardcoded value
                job_descr: job.description,
                directed_by: job.directedBy,
                location: job.location,
                cameraman: job.cameraman,
                equipment_items: job.equipmentItems,
                vat_percentage: vatPercentage,
                iban: invoice.iban,

                user_first_name: user.firstName,
                user_last_name: user.lastName,
                user_iban: user.iban,
                user_company_name: user.companyName,
                user_job_title: user.jobTitle,
                user_bank_account_nr: user.bankAccountNr,
                user_phone_nr: user.phoneNr,
                user_mobile_nr: user.mobileNr,
                user_email: user.email,
                user_chamber_of_commerce_nr: user.chamberOfCommerceNr,
                user_vat_nr: user.vatNr,
                user_var_nr: user.varNr,
                user_city: user.city,
                user_zipcode: user.zipcode,
                user_street: user.street,
                user_house_nr: user.houseNr
            });

        return html;
    }

}