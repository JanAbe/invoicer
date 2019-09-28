"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../src/db");
const sqliteInvoiceRepo_1 = require("../../src/adapters/persistence/sqlite/sqliteInvoiceRepo");
const sqliteClientRepo_1 = require("../../src/adapters/persistence/sqlite/sqliteClientRepo");
const sqliteJobRepo_1 = require("../../src/adapters/persistence/sqlite/sqliteJobRepo");
const invoiceService_1 = require("../../src/application/invoiceService");
const assert = require("assert");
describe('InvoiceService', () => {
    let invoiceService;
    let db;
    let clientRepo;
    let jobRepo;
    let invoiceRepo;
    let invoiceProps;
    before(() => {
        db = new db_1.DB(':memory:');
        db.createTables();
        clientRepo = new sqliteClientRepo_1.SqliteClientRepo(db);
        jobRepo = new sqliteJobRepo_1.SqliteJobRepo(db);
        invoiceRepo = new sqliteInvoiceRepo_1.SqliteInvoiceRepo(db, jobRepo);
        invoiceService = new invoiceService_1.InvoiceService(invoiceRepo, jobRepo, clientRepo);
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
        };
    });
    describe('createInvoice', () => {
        it('should create a new invoice without problems', () => __awaiter(void 0, void 0, void 0, function* () {
            yield assert.doesNotReject(() => __awaiter(void 0, void 0, void 0, function* () {
                return yield invoiceService.createInvoice(invoiceProps);
            }));
        }));
        it('should throw an error when a field is empty ("") when it is not allowed', () => __awaiter(void 0, void 0, void 0, function* () {
            invoiceProps['client']['city'] = '';
            yield assert.rejects(() => __awaiter(void 0, void 0, void 0, function* () {
                return yield invoiceService.createInvoice(invoiceProps);
            }));
        }));
        it('should throw an error when a field is undefined when it is not allowed', () => __awaiter(void 0, void 0, void 0, function* () {
            invoiceProps['iban'] = undefined;
            yield assert.rejects(() => __awaiter(void 0, void 0, void 0, function* () {
                return yield invoiceService.createInvoice(invoiceProps);
            }));
        }));
    });
});
//# sourceMappingURL=InvoiceService.test.js.map