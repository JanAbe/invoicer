import { Invoice } from "../../src/domain/invoice/invoice";
import { JobID } from "../../src/domain/invoice/job/jobID";
import { InvoiceID } from "../../src/domain/invoice/invoiceID";
import assert = require("assert");

describe('Invoice', () => {
    let invoiceID: InvoiceID;
    let jobID: JobID;

    before(() => {
        invoiceID = new InvoiceID('123');
        jobID = new JobID('123');
    });

    describe('constructor', () => {
        it('should create a new Invoice object', () => {
            assert.doesNotThrow(() => {
                new Invoice(invoiceID, jobID, 'NL68POIC1234567891');
            });
        });

        it('should throw an error when creating a new Invoice object with an invalid iban, one that is too long', () => {
            assert.throws(() => {
                new Invoice(invoiceID, jobID, 'NL68POIC123456789189238');
            });
        });
    });

    describe('generateInvoiceNumber', () => {
        it('should correctly generate the next InvoiceNumber', () => {
            const invoice = new Invoice(invoiceID, jobID, 'NL68POIC1234567891');
            const generatedNumber = invoice.generateInvoiceNumber();

            const expectedNumber = '';

            if (generatedNumber !== expectedNumber) {
                throw new Error(`Incorrect invoiceNumber generated. Expected: ${expectedNumber}, got: ${generatedNumber}`);
            }
        });
    });
});