import assert = require("assert");
import { Client } from "../../src/domain/client/client";
import { ClientID } from "../../src/domain/client/clientID";
import { FullName } from "../../src/domain/client/fullName";
import { Email } from "../../src/domain/client/email";
import { Address } from "../../src/domain/client/address";

describe('Client', () => {

    describe('constructor', () => {
        it('should create a new Client object', () => {
            assert.doesNotThrow(() => {
                new Client(
                    new ClientID('123'),
                    new FullName('bob', 'baker'),
                    new Email('bob@gmail.com'),
                    new Address('Milan', 'Mainstreet', 12, '4222PO')
                );
            });
        });
    });
});