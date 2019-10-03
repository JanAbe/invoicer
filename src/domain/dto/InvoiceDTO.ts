import { ClientDTO } from "./clientDTO";
import { JobDTO } from "./jobDTOx";

export class InvoiceDTO {
    public id?: string;
    public invoiceNumber?: string;
    public iban?: string;
    public projectNumber?: string;
    public creationDate?: Date;
    public vatPercentage?: number;

    public clientDTO?: ClientDTO;
    public jobDTO?: JobDTO

    constructor() {}
}