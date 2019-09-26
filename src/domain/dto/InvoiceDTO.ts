import { ClientDTO } from "./clientDTO";
import { JobDTO } from "./jobDTOx";


// todo: chose for a standard naming convention for embedded DTO's
// or job or jobDTO. Atm it is mixed through out all dto's.
export class InvoiceDTO {
    public id?: string;
    public invoiceNumber?: string;
    public projectNumber?: string;
    public creationDate?: Date;

    public clientDTO?: ClientDTO;
    public jobDTO?: JobDTO

    constructor() {}
}