"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const client_1 = require("../../src/domain/client/client");
const clientID_1 = require("../../src/domain/client/clientID");
const fullName_1 = require("../../src/domain/client/fullName");
const email_1 = require("../../src/domain/client/email");
const address_1 = require("../../src/domain/client/address");
describe('Client', () => {
    describe('constructor', () => {
        it('should create a new Client object', () => {
            assert.doesNotThrow(() => {
                new client_1.Client(new clientID_1.ClientID('123'), new fullName_1.FullName('bob', 'baker'), new email_1.Email('bob@gmail.com'), new address_1.Address('Milan', 'Mainstreet', 12, '4222PO'));
            });
        });
    });
});
//# sourceMappingURL=Client.test.js.map