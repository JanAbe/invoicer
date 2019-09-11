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
var PDFDocument = require("pdfkit");
var fs = require("fs");
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
    InvoiceService.prototype.fetchInvoiceByID = function (invoiceID) {
        this._invoiceRepo.invoiceOfID(invoiceID);
        throw new Error("Not implemented yet");
    };
    InvoiceService.prototype.fetchAllInvoices = function () {
        this._invoiceRepo.invoices();
        throw new Error("Not implemented yet");
    };
    InvoiceService.prototype.generatePDF = function (invoiceID) {
        return __awaiter(this, void 0, void 0, function () {
            var path, pdfName, invoice, job, client, doc, subtotal, btwPercentage, btwAmount, totalAmount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = '/home/janabe/Documents/Invoices';
                        pdfName = 'invoice.pdf';
                        return [4 /*yield*/, this._invoiceRepo.invoiceOfID(invoiceID)];
                    case 1:
                        invoice = _a.sent();
                        return [4 /*yield*/, this._jobRepo.jobOfID(invoice.jobID)];
                    case 2:
                        job = _a.sent();
                        return [4 /*yield*/, this._clientRepo.clientOfID(job.clientID)];
                    case 3:
                        client = _a.sent();
                        doc = new PDFDocument({ size: 'A4' });
                        doc.font('Courier');
                        // draw some text
                        doc.fontSize(20).text('Bobby Fernandez Produkties', 25, 25);
                        doc.fontSize(11).text("Amsterdam, " + new Date(invoice.creationDate).toLocaleDateString(), 380, 32);
                        doc.fontSize(11).text('De Epische Nationale Omroep', 25, 95);
                        doc.fontSize(11).text(client.address.street + " " + client.address.houseNumber, 25, 115);
                        doc.fontSize(11).text(client.address.zipcode + " " + client.address.city, 25, 135);
                        doc.fontSize(10).text('Faktuur Nummer: 2019A400', 360, 95);
                        doc.fontSize(10).text("Contactpersoon: " + client.fullName.firstName + " " + client.fullName.lastName, 360, 115, {
                            lineBreak: false
                        });
                        doc.fontSize(10).text('Project Nummer: 123982048', 360, 135);
                        doc.fontSize(11).text("Opdrachtomschrijving:  " + job.description, 25, 195);
                        doc.fontSize(11).text("Regie:                 " + job.directedBy, 25, 215);
                        doc.fontSize(11).text("Locatie:               " + job.location, 25, 235);
                        // doc.fontSize(11).text(`Werkdatum:             15-09-2019 t/m 19-09-2019`, 25, 255);
                        doc.fontSize(11).font('Courier-Bold').text('Apparatuurnaam   -   Startdatum   -   Einddatum   -   Dagprijs   -   Kosten', 25, 295);
                        doc.font('Courier');
                        subtotal = 0;
                        job.equipmentItems.forEach(function (item) {
                            doc.fontSize(11).text(item.name + "   -   " + item.period.startDate.toLocaleDateString() + "   -   " + item.period.endDate.toLocaleDateString() + "  -   " + item.dayPrice + "$       -   " + item.calculateCost() + "$", {
                                align: 'justify'
                            });
                            subtotal += item.calculateCost();
                        });
                        // doc.fontSize(11).text('Sony Camera 4k   -   15-09-2019   -   17-09-2019  -   400$       -   800$', 25, 315);
                        // doc.fontSize(11).text('Slider           -   15-09-2019   -   17-09-2019  -   80$        -   160$', 25, 335);
                        // doc.fontSize(11).text('Lamp             -   15-09-2019   -   19-09-2019  -   100$       -   400$', 25, 355);
                        // doc.fontSize(11).text('Led Panelen      -   15-09-2019   -   19-09-2019  -   130$       -   520$', 25, 375);
                        doc.fontSize(11).text("Subtotaal: " + subtotal + "$", 450);
                        doc.fontSize(11).text("Subtotaal: " + subtotal + "$", 25, 440);
                        btwPercentage = 21;
                        btwAmount = (btwPercentage / 100) * subtotal;
                        totalAmount = subtotal + btwAmount;
                        doc.fontSize(11).text("BTW " + btwPercentage + "%:   " + btwAmount + "$", 25, 460);
                        doc.fontSize(11).text("Totaal:    " + totalAmount + "$", 25, 480);
                        doc.fontSize(11).text('Betaalwijze: Binnen 30 dagen na factuurdatum', 25, 520);
                        doc.fontSize(11).text('SEI nr:      23423423', 25, 540);
                        doc.fontSize(11).text('t.n.v.:      B.H Fernandez', 25, 560);
                        doc.fontSize(11).text("IBAN:        " + invoice.iban, 25, 580);
                        doc.end();
                        // this doesn't create a new dir and file
                        // so these steps need to be made before this function is called.
                        doc.pipe(fs.createWriteStream(path + "/" + pdfName));
                        return [2 /*return*/];
                }
            });
        });
    };
    return InvoiceService;
}());
exports.InvoiceService = InvoiceService;
//# sourceMappingURL=invoiceService.js.map