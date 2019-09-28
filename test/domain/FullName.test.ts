import { FullName } from "../../src/domain/client/fullName";
import assert = require("assert");

describe('FullName', () => {
    
    describe('constructor', () => {
        it('should create a new fullName object', () => {
            const firstName = 'tom';
            const lastName = 'bicycle';
            const result = new FullName(firstName, lastName);
            if (result.firstName !== firstName) {
                throw new Error(`Fistname not correctly set. Expected: ${firstName}, got: ${result.firstName}`);
            }
            if (result.lastName !== lastName) {
                throw new Error(`Lastname not correctly set. Expected: ${lastName}, got: ${result.lastName}`);
            }
        });
    });

    describe('setFirstName', () => {
        it('should trim the input, removing whitespaces', () => {
            const firstName = '   tom ';
            const lastName = ' bicycle ';
            const result = new FullName(firstName, lastName);

            if (result.firstName !== 'tom') {
                throw new Error(`Fistname not correctly set. Expected: tom, got: ${result.firstName}`);
            }
            if (result.lastName !== 'bicycle') {
                throw new Error(`Lastname not correctly set. Expected: bicycle, got: ${result.lastName}`);
            }
        });

        it('should throw an error when the provided firstname is empty', () => {
            assert.throws(() => {
                new FullName('  ', 'Baker');
            });
        });
    });
});

