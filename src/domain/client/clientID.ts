export class ClientID {
    private _id: string;

    constructor(id: string) {
        this._id = id;
    }

    public toString(): string {
        return this._id;
    }

    private setID(id: string): void {
        // todo: needs check to see if incoming string is a UUID4
        this._id = id;
    }
}