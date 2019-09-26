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
            })
        })

        it('should throw an error when an invalid Street is provided', () => {
            assert.throws(() => {
                new Address('Milan', '', 12, '9823YY');
            })
        })

        it('should throw an error when an invalid HouseNumber is provided', () => {
            assert.throws(() => {
                new Address('Milan', 'Mainstreet', -2, '9823YY');
            })
        })

        it('should throw an error when an invalid Zipcode is provided', () => {
            assert.throws(() => {
                new Address('Milan', 'Mainstreet', 12, '98199OI');
            })
        })
    });
});