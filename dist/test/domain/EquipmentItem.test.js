"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const equipmentItem_1 = require("../../src/domain/invoice/job/equipmentItem");
const period_1 = require("../../src/domain/invoice/job/period");
const assert = require("assert");
describe('EquipmentItem', () => {
    let period;
    before(() => {
        const startDate = new Date('04/20/2019');
        const endDate = new Date('04/30/2019');
        period = new period_1.Period(startDate, endDate);
    });
    describe('constructor', () => {
        it('should return a new EquipmentItem object', () => {
            assert.doesNotThrow(() => {
                new equipmentItem_1.EquipmentItem('4K Camera', 300.29, period);
            });
        });
        it('should throw an error when creating a new EquipmentItem object with a negative dayPrice', () => {
            assert.throws(() => {
                new equipmentItem_1.EquipmentItem('4K Camera', -300.29, period);
            });
        });
    });
    describe('calculateCosts', () => {
        it('should return the correct amount of money owed by renting this EquipmentItem', () => {
            const equipmentItem = new equipmentItem_1.EquipmentItem('4K Camera', 300.29, period);
            const costs = equipmentItem.calculateCost();
            const expectedCosts = 3303.19;
            if (costs !== expectedCosts) {
                throw new Error(`Incorrect amount of money owed returned. Expected: ${expectedCosts}, got: ${costs}`);
            }
        });
    });
});
//# sourceMappingURL=EquipmentItem.test.js.map