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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var nunjucks = require("nunjucks");
var InvoiceDTO_1 = require("../domain/InvoiceDTO");
// InvoiceService contains all services a user can call regarding invoices
var InvoiceService = /** @class */ (function () {
    function InvoiceService(invoiceRepo, jobRepo, clientRepo) {
        this._invoiceRepo = invoiceRepo;
        this._jobRepo = jobRepo;
        this._clientRepo = clientRepo;
    }
    InvoiceService.prototype.createInvoice = function (invoice, job) {
        // creates an invoice and stores it in the database
        this._invoiceRepo.save(invoice, job);
    };
    // todo: implement this method / check if it works
    InvoiceService.prototype.fetchInvoiceByID = function (invoiceID) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._invoiceRepo.invoiceOfID(invoiceID)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // todo: implement this method / check if it works
    // changed return type to string because i couldn't figure out
    // how to use nunjucks in the client-side scripts
    InvoiceService.prototype.fetchAllInvoices = function () {
        return __awaiter(this, void 0, void 0, function () {
            var invoiceDTOs, invoices, _loop_1, this_1, _i, invoices_1, invoice;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invoiceDTOs = [];
                        return [4 /*yield*/, this._invoiceRepo.invoices()];
                    case 1:
                        invoices = _a.sent();
                        _loop_1 = function (invoice) {
                            var invoiceDTO;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        invoiceDTO = new InvoiceDTO_1.InvoiceDTO();
                                        invoiceDTO.id = invoice.invoiceID.toString();
                                        invoiceDTO.invoiceNumber = 'some number';
                                        invoiceDTO.creationDate = new Date(invoice.creationDate); // todo: look at fix for the need to make a new date obj from invoice.creationDate.
                                        return [4 /*yield*/, this_1._jobRepo.jobOfID(invoice.jobID)
                                                .then(function (job) {
                                                invoiceDTO.jobDescription = job.description;
                                                return job.clientID;
                                            })
                                                .then(function (clientID) {
                                                return _this._clientRepo.clientOfID(clientID);
                                            })
                                                .then(function (client) {
                                                invoiceDTO.clientName = client.fullName.toString();
                                            })
                                                .catch(function (err) {
                                                console.log(err);
                                            })];
                                    case 1:
                                        _a.sent();
                                        invoiceDTOs.push(invoiceDTO);
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, invoices_1 = invoices;
                        _a.label = 2;
                    case 2:
                        if (!(_i < invoices_1.length)) return [3 /*break*/, 5];
                        invoice = invoices_1[_i];
                        return [5 /*yield**/, _loop_1(invoice)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5:
                        nunjucks.configure('src/ui', { autoescape: true });
                        return [2 /*return*/, new Promise(function (resolve, reject) {
                                var html = nunjucks.render('invoice-row-template.html', {
                                    invoiceDTOs: invoiceDTOs
                                });
                                resolve(html);
                            })];
                }
            });
        });
    };
    // todo: look into used (!) exclamation marks
    // todo: look into best way to store money values
    // atm the number datatype is used.
    // 5964 + 1252.44 = 7216.4400000000005
    InvoiceService.prototype.generatePDF = function (invoiceID) {
        return __awaiter(this, void 0, void 0, function () {
            var invoice, job, client, vatPercentage, html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._invoiceRepo.invoiceOfID(invoiceID)];
                    case 1:
                        invoice = _a.sent();
                        return [4 /*yield*/, this._jobRepo.jobOfID(invoice.jobID)];
                    case 2:
                        job = _a.sent();
                        return [4 /*yield*/, this._clientRepo.clientOfID(job.clientID)];
                    case 3:
                        client = _a.sent();
                        vatPercentage = 21;
                        nunjucks.configure('src/ui', { autoescape: true });
                        html = nunjucks.render('invoice-template.html', {
                            creation_date: new Date(invoice.creationDate).toLocaleDateString(),
                            client_name: client.fullName.firstName + ' ' + client.fullName.lastName,
                            street: client.address.street,
                            house_number: client.address.houseNumber,
                            zipcode: client.address.zipcode,
                            city: client.address.city,
                            invoice_nr: '2019A32',
                            contact_person: client.fullName.firstName + ' ' + client.fullName.lastName,
                            project_nr: '823929',
                            job_descr: job.description,
                            directed_by: job.directedBy,
                            location: job.location,
                            cameraman: job.cameraman,
                            equipment_items: job.equipmentItems,
                            vat_percentage: vatPercentage,
                            iban: invoice.iban
                        });
                        return [2 /*return*/, html];
                }
            });
        });
    };
    return InvoiceService;
}());
exports.InvoiceService = InvoiceService;
//# sourceMappingURL=invoiceService.js.map