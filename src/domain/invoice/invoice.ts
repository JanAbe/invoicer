import { JobID } from "../job/jobID";
import { isNullOrUndefined } from "util";
import { InvoiceID } from "./invoiceID";
import IBAN = require('iban');
import { isEmpty } from "../../util/helpers";

export class Invoice {
    private _invoiceID!: InvoiceID;
    private _invoiceNumber!: string; 
    private _jobID!: JobID;
    private _iban!: string;
    private _creationDate: Date;

    constructor(invoiceID: InvoiceID, invoiceNumber: string, jobID: JobID, iban: string, creationDate: Date = new Date()) {
        this.setInvoiceID(invoiceID);
        this.setInvoiceNumber(invoiceNumber);
        this.setJobID(jobID);
        this.setIban(iban);
        this._creationDate = creationDate;
    }

    /**
     * Generates a new invoice number based on the amount of already present
     * invoices of this year, the creation date
     * @param nrOfInvoices the nr of invoices that are already made this year
     * @param creationDate the date this invoice is being made
     */
    public static generateInvoiceNumber(nrOfInvoices: number, creationDate: Date): string {
        const maxSize = 2; // max 99 invoiceNumbers can be made each year === enough room for growth
        if (nrOfInvoices === 99) {
            throw new Error("Max nr of invoices already reached. Aborting.")
        }
        nrOfInvoices++
        let nextInvoiceNumber = nrOfInvoices.toString();
        while (nextInvoiceNumber.length !== maxSize) {
            nextInvoiceNumber = `0${nextInvoiceNumber}`;
        }

        nextInvoiceNumber = `${creationDate.getFullYear()}${nextInvoiceNumber}`;

        return nextInvoiceNumber;
    }


    public get invoiceID(): InvoiceID {
        return this._invoiceID;
    }

    public get invoiceNumber(): string {
        return this._invoiceNumber;
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
    
    private setInvoiceID(invoiceID: InvoiceID) {
        if (isNullOrUndefined(invoiceID)) {
            throw new Error("Provided invoiceID is null or undefined");
        }

        this._invoiceID = invoiceID;
    }

    public setInvoiceNumber(invoiceNumber: string) {
        if (isNullOrUndefined(invoiceNumber)) {
            throw new Error("Provided invoiceNumber is null or undefined");
        }

        if (isEmpty(invoiceNumber)) {
            throw new Error("Provided invoiceNumber is empty");
        }

        this._invoiceNumber = invoiceNumber;
        
    }

    private setJobID(jobID: JobID) {
        if (isNullOrUndefined(jobID)) {
            throw new Error("Provided jobID is null or undefined");
        }

        this._jobID = jobID;
    }

    private setIban(iban: string) {
        if (isNullOrUndefined(iban)) {
            throw new Error("Provided iban is null or undefined");
        }
        
        if (!IBAN.isValid(iban)) {
            throw new Error("Provided iban is invalid");
        }

        this._iban = iban;
    }
}
