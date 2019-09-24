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
const InvoiceDTO_1 = require("../domain/dto/InvoiceDTO");
const nunjucks = require("nunjucks");
// InvoiceService contains all services a user can call regarding invoices
class InvoiceService {
    constructor(invoiceRepo, jobRepo, clientRepo, userRepo) {
        this._invoiceRepo = invoiceRepo;
        this._jobRepo = jobRepo;
        this._clientRepo = clientRepo;
        this._userRepo = userRepo;
    }
    // public createInvoice(invoice: Invoice, job: Job): void {
    //     this._invoiceRepo.save(invoice, job);
    // }
    createInvoice(iban, jobDTO, clientDTO, cameramanDTO, equipmentItemDTOs) {
        // todo: transform dto's into domain objects
        // and create jobID, clientID, invoiceID etc.
    }
    fetchInvoiceByID(invoiceID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._invoiceRepo.invoiceOfID(invoiceID);
        });
    }
    // rename to fetchAllInvoicesAndRenderHTML
    // or split in 2 functions
    // changed return type to string because i couldn't figure out
    // how to use nunjucks in the client-side scripts
    fetchAllInvoices() {
        return __awaiter(this, void 0, void 0, function* () {
            const invoiceDTOs = [];
            const invoices = yield this._invoiceRepo.invoices();
            for (const invoice of invoices) {
                const invoiceDTO = new InvoiceDTO_1.InvoiceDTO();
                invoiceDTO.id = invoice.invoiceID.toString();
                invoiceDTO.invoiceNumber = 'some number';
                invoiceDTO.creationDate = invoice.creationDate;
                yield this._jobRepo.jobOfID(invoice.jobID)
                    .then(job => {
                    invoiceDTO.jobDescription = job.description;
                    return job.clientID;
                })
                    .then(clientID => {
                    return this._clientRepo.clientOfID(clientID);
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
        });
    }
    // todo: remove hardcoded values and write code to support this
    // todo: rename to generateInvoiceHTML?
    // todo: look into used (!) exclamation marks
    // todo: look into best way to store money values
    // atm the number datatype is used.
    // 5964 + 1252.44 = 7216.4400000000005
    generateInvoice(invoiceID, userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this._invoiceRepo.invoiceOfID(invoiceID);
            const job = yield this._jobRepo.jobOfID(invoice.jobID);
            const client = yield this._clientRepo.clientOfID(job.clientID);
            const user = yield this._userRepo.userOfID(userID);
            const vatPercentage = 21;
            nunjucks.configure('src/ui', { autoescape: true });
            const html = nunjucks.render('invoice-template.html', {
                creation_date: invoice.creationDate,
                client_name: client.fullName.firstName + ' ' + client.fullName.lastName,
                street: client.address.street,
                house_number: client.address.houseNumber,
                zipcode: client.address.zipcode,
                city: client.address.city,
                invoice_nr: '2019A32',
                contact_person: client.fullName.firstName + ' ' + client.fullName.lastName,
                project_nr: 'n.v.t',
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
        });
    }
}
exports.InvoiceService = InvoiceService;
//# sourceMappingURL=invoiceService.js.map