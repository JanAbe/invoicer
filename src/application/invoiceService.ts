import { InvoiceID } from "../domain/invoice/invoiceID";
import { Invoice } from "../domain/invoice/invoice";
import { InvoiceRepo } from "../domain/invoice/invoiceRepo";
import { Job } from "../domain/job/job";
import { JobRepo } from "../domain/job/jobRepo";
import { ClientRepo } from "../domain/client/clientRepo";
import { InvoiceDTO } from "../domain/dto/InvoiceDTO";
import { Client } from "../domain/client/client";
import { FullName } from "../domain/client/fullName";
import { Email } from "../domain/client/email";
import { Address } from "../domain/client/address";
import { Cameraman } from "../domain/job/cameraman";
import { Period } from "../domain/job/period";
import { EquipmentItem } from "../domain/job/equipmentItem";
import { JobDTO } from "../domain/dto/jobDTOx";
import { ClientDTO } from "../domain/dto/clientDTO";
import { CameramanDTO } from "../domain/dto/cameramanDTO";
import { EquipmentItemDTO } from "../domain/dto/equipmentItemDTO";
import { ClientID } from "../domain/client/clientID";

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

    // todo: turn invoiceProps into its own calls or something
    public async createInvoice(invoiceProps: any) {
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
            );
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
        );

        const creationDate = new Date();
        const newInvoice = new Invoice(
            this._invoiceRepo.nextID(),
            await this._invoiceRepo.nextInvoiceNumber(creationDate),
            jobID,
            iban,
            creationDate
        );
        
        this._clientRepo.save(newClient);
        this._invoiceRepo.save(newInvoice, newJob);
    }

    /**
     * 
     * @param invoiceID invoiceID of invoice to delete
     * @param invoiceNumber old invoiceNumber, which is also the number that gets assigned to the newly updated invoice
     * @param clientID 
     * @param invoiceProps  
     */
    public async updateInvoice(invoiceID: string, invoiceNumber: string, clientID: string, invoiceProps: any): Promise<void> {
        // const { newClient, newJob, newInvoice } = await this.transformInvoiceProps(invoiceProps);
        // const client = new Client(new ClientID(clientID), newClient.fullName, newClient.email, newClient.address);
        // const job = new Job(newJob.id, newJob.description, newJob.location, newJob.directedBy, client.id, newJob.cameraman, newJob.equipmentItems);
        // const invoice = new Invoice(newInvoice.invoiceID, invoiceNumber, job.id!, newInvoice.iban, newInvoice.creationDate);

        const { iban, client, job, cameraman, equipmentItems } = invoiceProps; 
        const { clientFirstName, clientLastName, email, city, street, zipcode, houseNumber } = client;
        const { description, location, directedBy } = job;

        const newClient = new Client(
            new ClientID(clientID),
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
            );
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
            new ClientID(clientID),
            newCameraman!,
            newEquipmentItems
        );

        const creationDate = new Date();
        const newInvoice = new Invoice(
            this._invoiceRepo.nextID(),
            invoiceNumber,
            jobID,
            iban,
            creationDate
        );
        
        this._invoiceRepo.delete(new InvoiceID(invoiceID));
        this._invoiceRepo.update(new InvoiceID(invoiceID), newInvoice, newJob, newClient);
    }

    public async fetchAllInvoices(): Promise<InvoiceDTO[]> {
        const invoiceDTOs: InvoiceDTO[] = [];
        const invoices = await this._invoiceRepo.invoices();

        for (const invoice of invoices) {
            const invoiceDTO = new InvoiceDTO();
            invoiceDTO.id = invoice.invoiceID.toString();
            invoiceDTO.invoiceNumber = invoice.invoiceNumber;
            invoiceDTO.creationDate = invoice.creationDate;

            await this._jobRepo.jobOfID(invoice.jobID)
                .then(job => {
                    invoiceDTO.jobDTO = new JobDTO(job.description);
                    return job.clientID;
                })
                .then(clientID => {
                    return this._clientRepo.clientOfID(clientID!);
                })
                .then(client => {
                    invoiceDTO.clientDTO = new ClientDTO(
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
    public async fetchInvoiceByID(invoiceID: string): Promise<InvoiceDTO> {
        const invoice = await this._invoiceRepo.invoiceOfID(new InvoiceID(invoiceID));
        const job = await this._jobRepo.jobOfID(invoice.jobID);
        const client = await this._clientRepo.clientOfID(job.clientID!);

        const invoiceDTO = new InvoiceDTO();
        invoiceDTO.id = invoice.invoiceID.toString();
        invoiceDTO.invoiceNumber = invoice.invoiceNumber;
        invoiceDTO.projectNumber = 'project-number';
        invoiceDTO.iban = invoice.iban;
        invoiceDTO.creationDate = invoice.creationDate;
        invoiceDTO.vatPercentage = 21;
        invoiceDTO.clientDTO = new ClientDTO(
            client.fullName.firstName,
            client.fullName.lastName,
            client.email.emailAddress,
            client.address.city,
            client.address.street,
            client.address.houseNumber,
            client.address.zipcode,
            client.id.toString()
        )

        invoiceDTO.jobDTO = new JobDTO(
            job.description,
            job.location,
            job.directedBy,
            undefined,
            job.id!.toString(),
        );

        if (job.cameraman !== undefined) {
            invoiceDTO.jobDTO.cameramanDTO = new CameramanDTO(
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
        invoiceDTO.jobDTO.equipmentItemDTOs = equipmentItemDTOs;
        invoiceDTO.jobDTO.totalCosts = job.calculateCost();
        invoiceDTO.jobDTO.vatCosts = job.calculateVATCosts(invoiceDTO.jobDTO.totalCosts, invoiceDTO.vatPercentage);
        invoiceDTO.jobDTO.totalCostsWithVAT = job.calculateCostsIncludingVAT(invoiceDTO.jobDTO.totalCosts, invoiceDTO.jobDTO.vatCosts);
        
        return invoiceDTO;
    }

    public deleteInvoice(invoiceID: string): void {
        this._invoiceRepo.delete(new InvoiceID(invoiceID));
    }

    private async transformInvoiceProps(invoiceProps: any): Promise<{newClient: Client, newJob: Job, newInvoice: Invoice}> {
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
            );
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
        );

        const creationDate = new Date();
        const newInvoice = new Invoice(
            this._invoiceRepo.nextID(),
            await this._invoiceRepo.nextInvoiceNumber(creationDate),
            jobID,
            iban,
            creationDate
        );

        return { newClient, newJob, newInvoice }
    }
}