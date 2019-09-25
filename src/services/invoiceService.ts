import { InvoiceID } from "../domain/invoice/invoiceID";
import { Invoice } from "../domain/invoice/invoice";
import { InvoiceRepo } from "../domain/invoice/invoiceRepo";
import { Job } from "../domain/invoice/job/job";
import { JobRepo } from "../domain/invoice/job/jobRepo";
import { ClientRepo } from "../domain/client/clientRepo";
import { InvoiceDTO } from "../domain/dto/InvoiceDTO";
import { UserRepo } from "../domain/user/userRepo";
import { Client } from "../domain/client/client";
import { FullName } from "../domain/client/fullName";
import { Email } from "../domain/client/email";
import { Address } from "../domain/client/address";
import { Cameraman } from "../domain/invoice/job/cameraman";
import { Period } from "../domain/invoice/job/period";
import { EquipmentItem } from "../domain/invoice/job/equipmentItem";
import nunjucks = require('nunjucks');
import { HtmlService } from "./htmlService";
import { JobDTO } from "../domain/dto/jobDTOx";
import { ClientDTO } from "../domain/dto/clientDTO";
import { CameramanDTO } from "../domain/dto/cameramanDTO";
import { EquipmentItemDTO } from "../domain/dto/equipmentItemDTO";

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

    // rename to fetchAllInvoicesAndRenderHTML
        // or split in 2 functions
        // because atm it is tightly coupled with html and nunjucks
        // what if i want to send back a json representation or something
        // need to add a new adapter class that does stuff with html
    // changed return type to string because i couldn't figure out
    // how to use nunjucks in the client-side scripts
    public async fetchAllInvoices(): Promise<InvoiceDTO[]> {
        const invoiceDTOs: InvoiceDTO[] = [];
        const invoices = await this._invoiceRepo.invoices();

        for (const invoice of invoices) {
            const invoiceDTO = new InvoiceDTO();
            invoiceDTO.id = invoice.invoiceID.toString();
            invoiceDTO.invoiceNumber = 'some number';
            invoiceDTO.creationDate = invoice.creationDate;

            await this._jobRepo.jobOfID(invoice.jobID)
                .then(job => {
                    invoiceDTO.job = new JobDTO(job.description);
                    return job.clientID;
                })
                .then(clientID => {
                    return this._clientRepo.clientOfID(clientID!);
                })
                .then(client => {
                    invoiceDTO.client = new ClientDTO(
                        client.fullName.firstName,
                        client.fullName.lastName
                    );
                })
                .catch(err => {
                    console.log(err);
                });

            invoiceDTOs.push(invoiceDTO);
        }

        return invoiceDTOs;
    }

    // todo: remove hardcoded values and write code to support this
    // todo: rename to generateInvoiceHTML?
    // todo: look into used (!) exclamation marks
    // todo: look into best way to store money values
        // atm the number datatype is used.
            // 5964 + 1252.44 = 7216.4400000000005
    // todo: think about where i want to place this function
    // because it returns html it is pretty specific. Keep it here, or move to some htmlService?
    // todo: maybe rename / remove function?
    // make invoiceChannelManager call the htmlService directly instead of via this function?
    // but how does the invoiceChanManager get all necessary objects.
    // it needs to talk to the repositories, but they are in the inner hexagon, so this would mean
    // it would skip the application service layer, hmmm....
    public async fetchInvoiceByID(invoiceID: string): Promise<InvoiceDTO> {
        const invoice = await this._invoiceRepo.invoiceOfID(new InvoiceID(invoiceID));
        const job = await this._jobRepo.jobOfID(invoice.jobID);
        const client = await this._clientRepo.clientOfID(job.clientID!);

        const invoiceDTO = new InvoiceDTO();
        invoiceDTO.id = invoice.invoiceID.toString();
        invoiceDTO.invoiceNumber = 'some-number';
        invoiceDTO.projectNumber = 'project-number';
        invoiceDTO.creationDate = invoice.creationDate;
        invoiceDTO.client = new ClientDTO(
            client.fullName.firstName,
            client.fullName.lastName,
            client.email.emailAddress,
            client.address.city,
            client.address.street,
            client.address.houseNumber,
            client.address.zipcode,
            client.id.toString()
        )

        invoiceDTO.job = new JobDTO(
            job.description,
            job.location,
            job.directedBy,
            undefined,
            job.id!.toString(),
        );

        if (job.cameraman !== undefined) {
            invoiceDTO.job.cameramanDTO = new CameramanDTO(
                job.cameraman.firstName,
                job.cameraman.lastName,
                job.cameraman.dayPrice,
                job.cameraman.period.startDate,
                job.cameraman.period.endDate,
                job.cameraman.period.getDays(),
                job.cameraman.calculateCost() 
            )
        }

        const equipmentItemDTOs: EquipmentItemDTO[] = [];
        job.equipmentItems.forEach(e => {
            const { name, dayPrice, period } = e;
            equipmentItemDTOs.push(
                new EquipmentItemDTO(
                    name, 
                    dayPrice, 
                    period.startDate, 
                    period.endDate, 
                    period.getDays(),
                    e.calculateCost()
                )
            )
        });
        invoiceDTO.job.equipmentItemDTOs = equipmentItemDTOs;
        
        return invoiceDTO;
    }

}