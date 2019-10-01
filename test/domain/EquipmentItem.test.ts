import { EquipmentItem } from "../../src/domain/job/equipmentItem";
import { Period } from "../../src/domain/job/period";
import assert = require("assert");

describe('EquipmentItem', () => {
    let period: Period;

    before(() => {
        const startDate = new Date('04/20/2019');
        const endDate = new Date('04/30/2019');
        period = new Period(startDate, endDate);
    });

    describe('constructor', () => {
        it('should return a new EquipmentItem object', () => {
            assert.doesNotThrow(() => {
                new EquipmentItem('4K Camera', 300.29, period);
            });
        });

        it('should throw an error when creating a new EquipmentItem object with a negative dayPrice', () => {
            assert.throws(() => {
                new EquipmentItem('4K Camera', -300.29, period);
            });
        });
    });

    describe('calculateCosts', () => {
        it('should return the correct amount of money owed by renting this EquipmentItem', () => {
            const equipmentItem = new EquipmentItem('4K Camera', 300.29, period);

            const costs = equipmentItem.calculateCost();
            const expectedCosts = 3303.19;

            if (costs !== expectedCosts) {
                throw new Error(`Incorrect amount of money owed returned. Expected: ${expectedCosts}, got: ${costs}`);
            }
        });
    });
});