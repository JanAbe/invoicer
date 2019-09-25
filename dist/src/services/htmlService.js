"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nunjucks = require("nunjucks");
/**
 * HtmlService contains methods for creating and returning
 * rendered HTML templates.
 */
class HtmlService {
    static generateInvoiceTemplate(invoiceDTO, userDTO) {
        const vatPercentage = 21;
        nunjucks.configure('src/ui', { autoescape: true });
        const html = nunjucks.render('invoice-template.html', {
            invoiceDTO: invoiceDTO,
            userDTO: userDTO,
            vatPercentage: vatPercentage
            // creation_date: invoice.creationDate,
            // client_name: client.fullName.firstName + ' ' + client.fullName.lastName,
            // street: client.address.street,
            // house_number: client.address.houseNumber,
            // zipcode: client.address.zipcode,
            // city: client.address.city,
            // invoice_nr: '2019A32', // temp hardcoded value
            // contact_person: client.fullName.firstName + ' ' + client.fullName.lastName,
            // project_nr: 'n.v.t', // temp hardcoded value
            // job_descr: job.description,
            // directed_by: job.directedBy,
            // location: job.location,
            // cameraman: job.cameraman,
            // equipment_items: job.equipmentItems,
            // vat_percentage: vatPercentage,
            // iban: invoice.iban,
            // user_first_name: user.firstName,
            // user_last_name: user.lastName,
            // user_iban: user.iban,
            // user_company_name: user.companyName,
            // user_job_title: user.jobTitle,
            // user_bank_account_nr: user.bankAccountNr,
            // user_phone_nr: user.phoneNr,
            // user_mobile_nr: user.mobileNr,
            // user_email: user.email,
            // user_chamber_of_commerce_nr: user.chamberOfCommerceNr,
            // user_vat_nr: user.vatNr,
            // user_var_nr: user.varNr,
            // user_city: user.city,
            // user_zipcode: user.zipcode,
            // user_street: user.street,
            // user_house_nr: user.houseNr
        });
        return html;
    }
    static generateAllInvoiceTemplates(invoiceDTOs) {
        nunjucks.configure('src/ui', { autoescape: true });
        const html = nunjucks.render('invoice-row-template.html', {
            invoiceDTOs: invoiceDTOs
        });
        return html;
    }
}
exports.HtmlService = HtmlService;
//# sourceMappingURL=htmlService.js.map