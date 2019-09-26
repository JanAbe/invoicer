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