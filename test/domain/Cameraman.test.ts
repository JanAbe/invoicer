import { Cameraman } from "../../src/domain/job/cameraman";
import { Period } from "../../src/domain/job/period";
import assert = require("assert");

describe('Cameraman', () => {
    let period: Period;

    before(() => {
        const startDate = new Date('04/20/2019');
        const endDate = new Date('04/30/2019');
        period = new Period(startDate, endDate);
    });

    describe('constructor', () => {
        it('should create a new Cameraman object', () => {
            assert.doesNotThrow(() => {
                new Cameraman('bob', 'baker', 500.30, period);
            });
        });

        it('should throw an error when creating a new Cameraman object with a negative dayPrice', () => {
            assert.throws(() => {
                new Cameraman('bob', 'baker', -500.30, period);
            });
        });
    });

    describe('calculateCosts', () => {
        it('should return the correct amount of money owed by renting this cameraman', () => {
            const cameraman = new Cameraman('bob', 'baker', 500.30, period);

            const costs = cameraman.calculateCost();
            const expectedCosts = 5503.30;

            if (costs !== expectedCosts) {
                throw new Error(`Incorrect amount of money owed returned. Expected: ${expectedCosts}, got: ${costs}`);
            }
        });
    });
});