"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const address_1 = require("../../src/domain/client/address");
describe('Address', () => {
    describe('constructor', () => {
        it('should create a new Address object', () => {
            assert.doesNotThrow(() => {
                new address_1.Address('Milan', 'Mainstreet', 12, '9823YY');
            });
        });
        it('should throw an error when an invalid City is provided', () => {
            assert.throws(() => {
                new address_1.Address('', 'Mainstreet', 12, '9823YY');
            });
        });
        it('should throw an error when an invalid Street is provided', () => {
            assert.throws(() => {
                new address_1.Address('Milan', '', 12, '9823YY');
            });
        });
        it('should throw an error when an invalid HouseNumber is provided', () => {
            assert.throws(() => {
                new address_1.Address('Milan', 'Mainstreet', -2, '9823YY');
            });
        });
        it('should throw an error when an invalid Zipcode is provided', () => {
            assert.throws(() => {
                new address_1.Address('Milan', 'Mainstreet', 12, '98199OI');
            });
        });
    });
});
//# sourceMappingURL=Address.test.js.map