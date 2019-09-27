import assert = require("assert");
import { Address } from "../../src/domain/client/address";

describe('Address', () => {

    describe('constructor', () => {
        it('should create a new Address object', () => {
            assert.doesNotThrow(() => {
                new Address('Milan', 'Mainstreet', 12, '9823YY');
            });
        });
        
        it('should throw an error when an invalid City is provided', () => {
            assert.throws(() => {
                new Address('', 'Mainstreet', 12, '9823YY');
            });
        });

        it('should throw an error when an invalid Street is provided', () => {
            assert.throws(() => {
                new Address('Milan', '', 12, '9823YY');
            });
        });

        it('should throw an error when an invalid HouseNumber is provided', () => {
            assert.throws(() => {
                new Address('Milan', 'Mainstreet', -2, '9823YY');
            });
        });

        it('should not throw an error when a valid Zipcode is provided, wich has many spaces', () => {
            assert.doesNotThrow(() => {
                new Address('Milan', 'Mainstreet', 12, '9819    OI');
            });
        });

        it('should correctly format the valid zipcode', () => {
            const address = new Address('Milan', 'Mainstreet', 12, '9819    Oi');
            const expectedZipcode = '9819OI';

            if (address.zipcode !== expectedZipcode) {
                throw new Error(`Zipcode formatted incorrectly. Expected: ${expectedZipcode}, got: ${address.zipcode}`);
            }
        });

        it('should throw an error when an invalid Zipcode is provided, wich has too many numbers', () => {
            assert.throws(() => {
                new Address('Milan', 'Mainstreet', 12, '98199OI');
            });
        });
        
        it('should throw an error when an invalid Zipcode is provided, wich has too many letters', () => {
            assert.throws(() => {
                new Address('Milan', 'Mainstreet', 12, '9819OII');
            });
        });
    });
});