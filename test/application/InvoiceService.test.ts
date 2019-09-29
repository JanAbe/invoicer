import { DB } from "../../src/db";
import { InvoiceRepo } from "../../src/domain/invoice/invoiceRepo";
import { JobRepo } from "../../src/domain/invoice/job/jobRepo";
import { ClientRepo } from "../../src/domain/client/clientRepo";
import { SqliteInvoiceRepo } from "../../src/adapters/persistence/sqlite/sqliteInvoiceRepo";
import { SqliteClientRepo } from "../../src/adapters/persistence/sqlite/sqliteClientRepo";
import { SqliteJobRepo } from "../../src/adapters/persistence/sqlite/sqliteJobRepo";
import { InvoiceService } from "../../src/application/invoiceService";
import assert = require("assert");

describe('InvoiceService', () => {
    let invoiceService: InvoiceService;
    let db: DB;
    let clientRepo: ClientRepo;
    let jobRepo: JobRepo;
    let invoiceRepo: InvoiceRepo;
    let invoiceProps: any;

    before(() => {
        db = new DB(':memory:');
        db.createTables();
        clientRepo = new SqliteClientRepo(db);
        jobRepo = new SqliteJobRepo(db);
        invoiceRepo = new SqliteInvoiceRepo(db, jobRepo);
        invoiceService = new InvoiceService(invoiceRepo, jobRepo, clientRepo);
        invoiceProps = {
            'iban': 'NL68POIC1234567891',
            'client': {
                'clientFirstName': 'tom',
                'clientLastName': 'baker',
                'email': 'tom@email.com',
                'city': 'milan',
                'street': 'mainstreet',
                'zipcode': '1234UI',
                'houseNumber': 12 
            },
            'job': {
                'description': 'filming water',
                'location': 'milan',
                'directedBy': 'bob'
            },
            'cameraman': {
                'firstName': 'gert',
                'lastName': 'Cheese',
                'dayPrice': 400.00,
                'startDate': '12/09/2019',
                'endDate': '12/09/2019'
            },
            'equipmentItems': undefined
        }
    });

    describe('createInvoice', () => {
        it('should create a new invoice without problems', async () => {
            // it fails because i don't know how to mock / use memory db
            await assert.doesNotReject(async () => {
                return await invoiceService.createInvoice(invoiceProps);
            });
        });

        it('should throw an error when a field is empty ("") when it is not allowed', async () => {
            invoiceProps['client']['city'] = '';
            await assert.rejects(async () => {
                return await invoiceService.createInvoice(invoiceProps);
            });
        });

        it('should throw an error when a field is undefined when it is not allowed', async () => {
            invoiceProps['iban'] = undefined;
            await assert.rejects(async () => {
                return await invoiceService.createInvoice(invoiceProps);
            });
        })
    });

    describe('fetchAllInvoices', () => {
        it('should be executed with no problems', async () => {
            await assert.doesNotReject(async () => {
                return await invoiceService.fetchAllInvoices();
            });
        });
    });

    describe('fetchInvoiceByID', () => {
        it('should reject when an invoiceID is entered that does not exist', async () => {
            await assert.rejects(async () => {
                return await invoiceService.fetchInvoiceByID('4a3630c1-2706-47f1-8d00-a04e29b4b130');
            });
        });

        it('should reject when an invalid id is passed', async () => {
            await assert.rejects(async () => {
                return await invoiceService.fetchInvoiceByID('');
            });
        });
    });
});