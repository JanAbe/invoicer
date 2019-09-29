"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const invoice_1 = require("../../src/domain/invoice/invoice");
const jobID_1 = require("../../src/domain/invoice/job/jobID");
const invoiceID_1 = require("../../src/domain/invoice/invoiceID");
const assert = require("assert");
describe('Invoice', () => {
    let invoiceID;
    let jobID;
    let invoiceNumber;
    before(() => {
        invoiceID = new invoiceID_1.InvoiceID('123');
        jobID = new jobID_1.JobID('123');
        invoiceNumber = '123';
    });
    describe('constructor', () => {
        it('should create a new Invoice object', () => {
            assert.doesNotThrow(() => {
                new invoice_1.Invoice(invoiceID, invoiceNumber, jobID, 'NL68POIC1234567891');
            });
        });
        it('should throw an error when creating a new Invoice object with an invalid iban, one that is too long', () => {
            assert.throws(() => {
                new invoice_1.Invoice(invoiceID, invoiceNumber, jobID, 'NL68POIC123456789189238');
            });
        });
    });
    describe('generateInvoiceNumber', () => {
        it('should correctly generate the next InvoiceNumber with no previous invoices present', () => {
            const date = new Date('05/08/2019'); // this has the format mm/dd/yyyy
            const generatedNumber = invoice_1.Invoice.generateInvoiceNumber(0, date);
            const expectedNumber = '201901';
            if (generatedNumber !== expectedNumber) {
                throw new Error(`Incorrect invoiceNumber generated. Expected: ${expectedNumber}, got: ${generatedNumber}`);
            }
        });
        it('should correctly generate the next InvoiceNumber with previous invoices present', () => {
            const date = new Date('05/08/2019'); // this has the format mm/dd/yyyy
            const generatedNumber = invoice_1.Invoice.generateInvoiceNumber(4, date);
            const expectedNumber = '201905';
            if (generatedNumber !== expectedNumber) {
                throw new Error(`Incorrect invoiceNumber generated. Expected: ${expectedNumber}, got: ${generatedNumber}`);
            }
        });
        it('should throw an error when generating a new invoiceNumber when the limit is already reached', () => {
            const date = new Date('05/08/2019'); // this has the format mm/dd/yyyy
            assert.throws(() => {
                invoice_1.Invoice.generateInvoiceNumber(99, date);
            });
        });
    });
});
//# sourceMappingURL=Invoice.test.js.map