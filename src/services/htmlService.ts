import { Invoice } from "../domain/invoice/invoice";
import { Job } from "../domain/invoice/job/job";
import { Client } from "../domain/client/client";
import { UserDTO } from "../domain/dto/userDTO";
import { InvoiceDTO } from "../domain/dto/InvoiceDTO";
import nunjucks = require('nunjucks');

/**
 * HtmlService contains methods for creating and returning
 * rendered HTML templates.
 */
export class HtmlService {

    public static generateInvoiceTemplate(invoiceDTO: InvoiceDTO, userDTO: UserDTO): string {
            const vatPercentage = 21;

            nunjucks.configure('src/ui', { autoescape: true });
            const html = nunjucks.render('invoice-template.html', 
            { 
                invoiceDTO: invoiceDTO,
                userDTO: userDTO,
                vatPercentage: vatPercentage
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