"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_1 = require("../../src/domain/client/email");
const assert = require("assert");
describe('Email', () => {
    describe('constructor', () => {
        it('should create a new Email object', () => {
            assert.doesNotThrow(() => {
                new email_1.Email('bob@gmail.com');
            });
        });
        it('should throw an error when creating a new Email object with an invalid emailaddress', () => {
            assert.throws(() => {
                new email_1.Email('invalidEmail.com');
            });
        });
    });
});
//# sourceMappingURL=Email.test.js.map