import { InvoiceID } from "../domain/invoiceID";
import { Invoice } from "../domain/invoice";
import { InvoiceRepo } from "../repos/invoiceRepo";
import { Job } from "../domain/job";
import { JobRepo } from "../repos/jobRepo";
import PDFDocument = require('pdfkit');
import fs = require('fs');
import { ClientRepo } from "../repos/clientRepo";

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

    public createInvoice(invoice: Invoice, job: Job): void {
        // creates an invoice and stores it in the database
        this._invoiceRepo.save(invoice, job);
    }

    public fetchInvoiceByID(invoiceID: InvoiceID): Invoice {
        this._invoiceRepo.invoiceOfID(invoiceID);
        throw new Error("Not implemented yet");
    }

    public fetchAllInvoices(): Invoice[] {
        this._invoiceRepo.invoices();
        throw new Error("Not implemented yet");
    }

    public async generatePDF(invoiceID: InvoiceID): Promise<void> {
        /*
        fetch invoice with id=invoiceID from database 
        create a pdf with all the necessary information 
            (gotten from the fetched invoice)
        store the pdf in the location chosen by the user
            (e.g. /home/user/Documents/invoices/)
        */
    
        // $HOME doesn't work :(    
        const path = '/home/janabe/Documents/Invoices';
        const pdfName = 'invoice.pdf';

        const invoice = await this._invoiceRepo.invoiceOfID(invoiceID);
        const job = await this._jobRepo.jobOfID(invoice.jobID);
        const client = await this._clientRepo.clientOfID(job.clientID!);

        const doc = new PDFDocument({size: 'A4'});

        doc.font('Courier')

        // draw some text
        doc.fontSize(20).text('Bobby Fernandez Produkties', 25, 25);
        doc.fontSize(11).text(`Amsterdam, ${new Date(invoice.creationDate).toLocaleDateString()}`, 380, 32);

        doc.fontSize(11).text('De Epische Nationale Omroep', 25, 95);
        doc.fontSize(11).text(`${client.address.street} ${client.address.houseNumber}`, 25, 115);
        doc.fontSize(11).text(`${client.address.zipcode} ${client.address.city}`, 25, 135);

        doc.fontSize(10).text('Faktuur Nummer: 2019A400', 360, 95);
        doc.fontSize(10).text(`Contactpersoon: ${client.fullName.firstName} ${client.fullName.lastName}`, 360, 115, {
            lineBreak: false
        });
        doc.fontSize(10).text('Project Nummer: 123982048', 360, 135);

        doc.fontSize(11).text(`Opdrachtomschrijving:  ${job.description}`, 25, 195);
        doc.fontSize(11).text(`Regie:                 ${job.directedBy}`, 25, 215);
        doc.fontSize(11).text(`Locatie:               ${job.location}`, 25, 235);
        // doc.fontSize(11).text(`Werkdatum:             15-09-2019 t/m 19-09-2019`, 25, 255);

        doc.fontSize(11).font('Courier-Bold').text('Apparatuurnaam   -   Startdatum   -   Einddatum   -   Dagprijs   -   Kosten', 25, 295);
        doc.font('Courier');

        let subtotal: number = 0;
        job.equipmentItems.forEach(item => {
            doc.fontSize(11).text(`${item.name}   -   ${item.period.startDate.toLocaleDateString()}   -   ${item.period.endDate.toLocaleDateString()}  -   ${item.dayPrice}$       -   ${item.calculateCost()}$`, {
                align: 'justify'
            });
            subtotal += item.calculateCost();
        })
        // doc.fontSize(11).text('Sony Camera 4k   -   15-09-2019   -   17-09-2019  -   400$       -   800$', 25, 315);
        // doc.fontSize(11).text('Slider           -   15-09-2019   -   17-09-2019  -   80$        -   160$', 25, 335);
        // doc.fontSize(11).text('Lamp             -   15-09-2019   -   19-09-2019  -   100$       -   400$', 25, 355);
        // doc.fontSize(11).text('Led Panelen      -   15-09-2019   -   19-09-2019  -   130$       -   520$', 25, 375);

        doc.fontSize(11).text(`Subtotaal: ${subtotal}$`, 450);

        doc.fontSize(11).text(`Subtotaal: ${subtotal}$`, 25, 440);

        const btwPercentage = 21;
        const btwAmount = (btwPercentage / 100) * subtotal;
        const totalAmount = subtotal + btwAmount;
        doc.fontSize(11).text(`BTW ${btwPercentage}%:   ${btwAmount}$`, 25, 460);
        doc.fontSize(11).text(`Totaal:    ${totalAmount}$`, 25, 480);

        doc.fontSize(11).text('Betaalwijze: Binnen 30 dagen na factuurdatum', 25, 520);
        doc.fontSize(11).text('SEI nr:      23423423', 25, 540);
        doc.fontSize(11).text('t.n.v.:      B.H Fernandez', 25, 560);
        doc.fontSize(11).text(`IBAN:        ${invoice.iban}`, 25, 580);

        doc.end();
        // this doesn't create a new dir and file
        // so these steps need to be made before this function is called.
        doc.pipe(fs.createWriteStream(`${path}/${pdfName}`));
        return;
    }

}