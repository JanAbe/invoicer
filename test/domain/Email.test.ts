import { Email } from "../../src/domain/client/email";
import assert = require("assert");

describe('Email', () => {

    describe('constructor', () => {
        it('should create a new Email object', () => {
            assert.doesNotThrow(() => {
                new Email('bob@gmail.com');
            });
        });

        it('should throw an error when creating a new Email object with an invalid emailaddress', () => {
            assert.throws(() => {
                new Email('invalidEmail.com');
            });
        });
    });
});