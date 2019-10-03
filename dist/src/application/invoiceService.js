"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const invoiceID_1 = require("../domain/invoice/invoiceID");
const invoice_1 = require("../domain/invoice/invoice");
const job_1 = require("../domain/job/job");
const InvoiceDTO_1 = require("../domain/dto/InvoiceDTO");
const client_1 = require("../domain/client/client");
const fullName_1 = require("../domain/client/fullName");
const email_1 = require("../domain/client/email");
const address_1 = require("../domain/client/address");
const cameraman_1 = require("../domain/job/cameraman");
const period_1 = require("../domain/job/period");
const equipmentItem_1 = require("../domain/job/equipmentItem");
const jobDTOx_1 = require("../domain/dto/jobDTOx");
const clientDTO_1 = require("../domain/dto/clientDTO");
const cameramanDTO_1 = require("../domain/dto/cameramanDTO");
const equipmentItemDTO_1 = require("../domain/dto/equipmentItemDTO");
const clientID_1 = require("../domain/client/clientID");
// InvoiceService contains all services a user can call regarding invoices
class InvoiceService {
    constructor(invoiceRepo, jobRepo, clientRepo) {
        this._invoiceRepo = invoiceRepo;
        this._jobRepo = jobRepo;
        this._clientRepo = clientRepo;
    }
    // todo: turn invoiceProps into its own calls or something
    createInvoice(invoiceProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const { iban, client, job, cameraman, equipmentItems } = invoiceProps;
            const { clientFirstName, clientLastName, email, city, street, zipcode, houseNumber } = client;
            const { description, location, directedBy } = job;
            const clientID = this._clientRepo.nextID();
            const newClient = new client_1.Client(clientID, new fullName_1.FullName(clientFirstName, clientLastName), new email_1.Email(email), new address_1.Address(city, street, houseNumber, zipcode));
            let newCameraman;
            if (cameraman !== undefined) {
                const { firstName, lastName, dayPrice, startDate, endDate } = cameraman;
                newCameraman = new cameraman_1.Cameraman(firstName, lastName, dayPrice, new period_1.Period(new Date(startDate), new Date(endDate)));
            }
            let newEquipmentItems = [];
            if (equipmentItems !== undefined) {
                equipmentItems.forEach((e) => {
                    const { equipmentItemName, equipmentItemDayPrice, equipmentItemStartDate, equipmentItemEndDate } = e;
                    newEquipmentItems.push(new equipmentItem_1.EquipmentItem(equipmentItemName, equipmentItemDayPrice, new period_1.Period(new Date(equipmentItemStartDate), new Date(equipmentItemEndDate))));
                });
            }
            const jobID = this._jobRepo.nextID();
            const newJob = new job_1.Job(jobID, description, location, directedBy, clientID, newCameraman, newEquipmentItems);
            const creationDate = new Date();
            const newInvoice = new invoice_1.Invoice(this._invoiceRepo.nextID(), yield this._invoiceRepo.nextInvoiceNumber(creationDate), jobID, iban, creationDate);
            this._clientRepo.save(newClient);
            this._invoiceRepo.save(newInvoice, newJob);
        });
    }
    updateInvoice(invoiceID, invoiceNumber, clientID, invoiceProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const { newClient, newJob, newInvoice } = yield this.transformInvoiceProps(invoiceProps);
            const client = new client_1.Client(new clientID_1.ClientID(clientID), newClient.fullName, newClient.email, newClient.address);
            const job = new job_1.Job(newJob.id, newJob.description, newJob.location, newJob.directedBy, client.id, newJob.cameraman, newJob.equipmentItems);
            const invoice = new invoice_1.Invoice(newInvoice.invoiceID, newInvoice.invoiceNumber, job.id, newInvoice.iban, newInvoice.creationDate);
            newInvoice.setInvoiceNumber(invoiceNumber);
            this._invoiceRepo.update(new invoiceID_1.InvoiceID(invoiceID), invoice, job, client);
        });
    }
    fetchAllInvoices() {
        return __awaiter(this, void 0, void 0, function* () {
            const invoiceDTOs = [];
            const invoices = yield this._invoiceRepo.invoices();
            for (const invoice of invoices) {
                const invoiceDTO = new InvoiceDTO_1.InvoiceDTO();
                invoiceDTO.id = invoice.invoiceID.toString();
                invoiceDTO.invoiceNumber = invoice.invoiceNumber;
                invoiceDTO.creationDate = invoice.creationDate;
                yield this._jobRepo.jobOfID(invoice.jobID)
                    .then(job => {
                    invoiceDTO.jobDTO = new jobDTOx_1.JobDTO(job.description);
                    return job.clientID;
                })
                    .then(clientID => {
                    return this._clientRepo.clientOfID(clientID);
                })
                    .then(client => {
                    invoiceDTO.clientDTO = new clientDTO_1.ClientDTO(client.fullName.firstName, client.fullName.lastName);
                })
                    .catch(err => {
                    console.log(err);
                });
                invoiceDTOs.push(invoiceDTO);
            }
            return invoiceDTOs;
        });
    }
    // todo: remove hardcoded values and write code to support this
    fetchInvoiceByID(invoiceID) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this._invoiceRepo.invoiceOfID(new invoiceID_1.InvoiceID(invoiceID));
            const job = yield this._jobRepo.jobOfID(invoice.jobID);
            const client = yield this._clientRepo.clientOfID(job.clientID);
            const invoiceDTO = new InvoiceDTO_1.InvoiceDTO();
            invoiceDTO.id = invoice.invoiceID.toString();
            invoiceDTO.invoiceNumber = invoice.invoiceNumber;
            invoiceDTO.projectNumber = 'project-number';
            invoiceDTO.iban = invoice.iban;
            invoiceDTO.creationDate = invoice.creationDate;
            invoiceDTO.vatPercentage = 21;
            invoiceDTO.clientDTO = new clientDTO_1.ClientDTO(client.fullName.firstName, client.fullName.lastName, client.email.emailAddress, client.address.city, client.address.street, client.address.houseNumber, client.address.zipcode, client.id.toString());
            invoiceDTO.jobDTO = new jobDTOx_1.JobDTO(job.description, job.location, job.directedBy, undefined, job.id.toString());
            if (job.cameraman !== undefined) {
                invoiceDTO.jobDTO.cameramanDTO = new cameramanDTO_1.CameramanDTO(job.cameraman.firstName, job.cameraman.lastName, job.cameraman.dayPrice, job.cameraman.period.startDate, job.cameraman.period.endDate, job.cameraman.period.getDays(), job.cameraman.calculateCost());
            }
            const equipmentItemDTOs = [];
            job.equipmentItems.forEach(e => {
                const { name, dayPrice, period } = e;
                equipmentItemDTOs.push(new equipmentItemDTO_1.EquipmentItemDTO(name, dayPrice, period.startDate, period.endDate, period.getDays(), e.calculateCost()));
            });
            invoiceDTO.jobDTO.equipmentItemDTOs = equipmentItemDTOs;
            invoiceDTO.jobDTO.totalCosts = job.calculateCost();
            invoiceDTO.jobDTO.vatCosts = job.calculateVATCosts(invoiceDTO.jobDTO.totalCosts, invoiceDTO.vatPercentage);
            invoiceDTO.jobDTO.totalCostsWithVAT = job.calculateCostsIncludingVAT(invoiceDTO.jobDTO.totalCosts, invoiceDTO.jobDTO.vatCosts);
            return invoiceDTO;
        });
    }
    deleteInvoice(invoiceID) {
        this._invoiceRepo.delete(new invoiceID_1.InvoiceID(invoiceID));
    }
    transformInvoiceProps(invoiceProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const { iban, client, job, cameraman, equipmentItems } = invoiceProps;
            const { clientFirstName, clientLastName, email, city, street, zipcode, houseNumber } = client;
            const { description, location, directedBy } = job;
            const clientID = this._clientRepo.nextID();
            const newClient = new client_1.Client(clientID, new fullName_1.FullName(clientFirstName, clientLastName), new email_1.Email(email), new address_1.Address(city, street, houseNumber, zipcode));
            let newCameraman;
            if (cameraman !== undefined) {
                const { firstName, lastName, dayPrice, startDate, endDate } = cameraman;
                newCameraman = new cameraman_1.Cameraman(firstName, lastName, dayPrice, new period_1.Period(new Date(startDate), new Date(endDate)));
            }
            let newEquipmentItems = [];
            if (equipmentItems !== undefined) {
                equipmentItems.forEach((e) => {
                    const { equipmentItemName, equipmentItemDayPrice, equipmentItemStartDate, equipmentItemEndDate } = e;
                    newEquipmentItems.push(new equipmentItem_1.EquipmentItem(equipmentItemName, equipmentItemDayPrice, new period_1.Period(new Date(equipmentItemStartDate), new Date(equipmentItemEndDate))));
                });
            }
            const jobID = this._jobRepo.nextID();
            const newJob = new job_1.Job(jobID, description, location, directedBy, clientID, newCameraman, newEquipmentItems);
            const creationDate = new Date();
            const newInvoice = new invoice_1.Invoice(this._invoiceRepo.nextID(), yield this._invoiceRepo.nextInvoiceNumber(creationDate), jobID, iban, creationDate);
            return { newClient, newJob, newInvoice };
        });
    }
}
exports.InvoiceService = InvoiceService;
//# sourceMappingURL=invoiceService.js.map