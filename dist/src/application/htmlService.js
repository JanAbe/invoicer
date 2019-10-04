"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nunjucks = require("nunjucks");
/**
 * HtmlService contains methods for creating and returning
 * rendered HTML templates.
 */
class HtmlService {
    static generateInvoiceTemplate(invoiceDTO, userDTO) {
        console.log(`${__dirname}/../ui`);
        nunjucks.configure(`${__dirname}/../ui`, { autoescape: true });
        const html = nunjucks.render('invoice-template.html', {
            invoiceDTO: invoiceDTO,
            userDTO: userDTO,
        });
        return html;
    }
    static generateAllInvoiceTemplates(invoiceDTOs) {
        nunjucks.configure(`${__dirname}/../ui`, { autoescape: true });
        const html = nunjucks.render('invoice-row-template.html', {
            invoiceDTOs: invoiceDTOs
        });
        return html;
    }
    static generateEditInvoiceTemplate(invoiceDTO) {
        nunjucks.configure('src/ui', { autoescape: true });
        const html = nunjucks.render('edit-invoice-template.html', {
            invoiceDTO: invoiceDTO
        });
        return html;
    }
}
exports.HtmlService = HtmlService;
//# sourceMappingURL=htmlService.js.map