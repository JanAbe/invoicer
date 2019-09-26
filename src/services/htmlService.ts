import { UserDTO } from "../domain/dto/userDTO";
import { InvoiceDTO } from "../domain/dto/InvoiceDTO";
import nunjucks = require('nunjucks');

/**
 * HtmlService contains methods for creating and returning
 * rendered HTML templates.
 */
export class HtmlService {

    public static generateInvoiceTemplate(invoiceDTO: InvoiceDTO, userDTO: UserDTO): string {
            nunjucks.configure('src/ui', { autoescape: true });
            const html = nunjucks.render('invoice-template.html', 
            { 
                invoiceDTO: invoiceDTO,
                userDTO: userDTO,
            });

        return html;
    }

    public static generateAllInvoiceTemplates(invoiceDTOs: InvoiceDTO[]): string {
        nunjucks.configure('src/ui', { autoescape: true });
        const html = nunjucks.render('invoice-row-template.html', { 
            invoiceDTOs: invoiceDTOs 
        });

        return html;
    }
}