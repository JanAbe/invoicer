import { Invoice } from "../../src/domain/invoice/invoice";
import { JobID } from "../../src/domain/invoice/job/jobID";
import { InvoiceID } from "../../src/domain/invoice/invoiceID";
import assert = require("assert");

describe('Invoice', () => {
    let invoiceID: InvoiceID;
    let jobID: JobID;
    let invoiceNumber: string;

    before(() => {
        invoiceID = new InvoiceID('123');
        jobID = new JobID('123');
        invoiceNumber = '123';
    });

    describe('constructor', () => {
        it('should create a new Invoice object', () => {
            assert.doesNotThrow(() => {
                new Invoice(invoiceID, invoiceNumber, jobID, 'NL68POIC1234567891');
            });
        });

        it('should throw an error when creating a new Invoice object with an invalid iban, one that is too long', () => {
            assert.throws(() => {
                new Invoice(invoiceID, invoiceNumber, jobID, 'NL68POIC123456789189238');
            });
        });
    });

    describe('generateInvoiceNumber', () => {
        it('should correctly generate the next InvoiceNumber with no previous invoices present', () => {
            const date = new Date('05/08/2019'); // this has the format mm/dd/yyyy
            const generatedNumber = Invoice.generateInvoiceNumber(0, date);
            const expectedNumber = '201901';

            if (generatedNumber !== expectedNumber) {
                throw new Error(`Incorrect invoiceNumber generated. Expected: ${expectedNumber}, got: ${generatedNumber}`);
            }
        });
        
        it('should correctly generate the next InvoiceNumber with previous invoices present', () => {
            const date = new Date('05/08/2019'); // this has the format mm/dd/yyyy
            const generatedNumber = Invoice.generateInvoiceNumber(4, date);
            const expectedNumber = '201905';

            if (generatedNumber !== expectedNumber) {
                throw new Error(`Incorrect invoiceNumber generated. Expected: ${expectedNumber}, got: ${generatedNumber}`);
            }
        });

        it('should throw an error when generating a new invoiceNumber when the limit is already reached', () => {
            const date = new Date('05/08/2019'); // this has the format mm/dd/yyyy
            assert.throws(() => {
                Invoice.generateInvoiceNumber(99, date);
            });
        });
    });
});