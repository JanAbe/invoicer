import { JobID } from "./jobID";
// import IBAN = require('iban');
import { isNullOrUndefined } from "util";
import { InvoiceID } from "./invoiceID";

export class Invoice {
    private _invoiceID: InvoiceID;
    private _jobID: JobID;
    private _iban: string;
    private _creationDate: Date;

    constructor(invoiceID: InvoiceID, jobID: JobID, iban: string, creationDate: Date = new Date()) {
        this._invoiceID = invoiceID;
        this._jobID = jobID;
        this._iban = iban;
        this._creationDate = creationDate;
    }

    public generateInvoiceNumber(): string {
       throw new Error(); 
    }

    public get invoiceID(): InvoiceID {
        return this._invoiceID;
    }

    public get jobID(): JobID {
        return this._jobID;
    }

    public get iban(): string {
        return this._iban;
    }

    public get creationDate(): Date {
        return this._creationDate;
    }
    
    public set invoiceID(invoiceID: InvoiceID) {
        if (isNullOrUndefined(invoiceID)) {
            throw new Error("Provided invoiceID is null or undefined");
        }

        this._invoiceID = invoiceID;
    }

    // do i want to make it possible to change the jobID of an invoice?
    public set jobID(jobID: JobID) {
        if (isNullOrUndefined(jobID)) {
            throw new Error("Provided jobID is null or undefined");
        }

        this._jobID = jobID;
    }

    public set iban(iban: string) {
        if (isNullOrUndefined(iban)) {
            throw new Error("Provided iban is null or undefined");
        }

        // if (!IBAN.isValid(iban)) {
        //     throw new Error("Provided iban is invalid");
        // }

        this._iban = iban;
    }
}
