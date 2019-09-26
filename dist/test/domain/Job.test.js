"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const job_1 = require("../../src/domain/invoice/job/job");
const jobID_1 = require("../../src/domain/invoice/job/jobID");
const cameraman_1 = require("../../src/domain/invoice/job/cameraman");
const equipmentItem_1 = require("../../src/domain/invoice/job/equipmentItem");
const period_1 = require("../../src/domain/invoice/job/period");
describe('Job', () => {
    let job;
    before(() => {
        const startDate = new Date('04/20/2019');
        const endDate = new Date('04/30/2019');
        const period = new period_1.Period(startDate, endDate);
        job = new job_1.Job(new jobID_1.JobID('123'), 'Filming a play', 'Milan', 'Mike', undefined, new cameraman_1.Cameraman('bob', 'baker', 500.30, period), [
            new equipmentItem_1.EquipmentItem('Camera', 300.31, period),
            new equipmentItem_1.EquipmentItem('Slider', 40.68, period)
        ]);
    });
    describe('calculateCosts', () => {
        it('should give the correct amount of money owed despite decimal prices', () => {
            const costs = job.calculateCost();
            const expectedCosts = 9254.19;
            if (costs !== expectedCosts) {
                throw new Error(`Incorrect amount of money owed returned. Expected: ${expectedCosts}, got: ${costs}`);
            }
        });
    });
    describe('calculateVATCosts', () => {
        it('should give the correct amount of money added because of VAT', () => {
            const vatPercentage = 21;
            const costs = job.calculateCost();
            const vatCosts = job.calculateVATCosts(costs, vatPercentage);
            const expectedCosts = 1943.38;
            if (vatCosts !== expectedCosts) {
                throw new Error(`Incorrect amount of money returned. Expected: ${expectedCosts}, got: ${vatCosts}`);
            }
        });
    });
    describe('calculateCostsIncludingVAT', () => {
        it('should give the correct amount of money owed, including VAT', () => {
            const vatPercentage = 21;
            const costs = job.calculateCost();
            const vatCosts = job.calculateVATCosts(costs, vatPercentage);
            const totalCosts = job.calculateCostsIncludingVAT(costs, vatCosts);
            const expectedCosts = 11197.57;
            if (totalCosts !== expectedCosts) {
                throw new Error(`Incorrect amount of money owed returned. Expected: ${expectedCosts}, got: ${totalCosts}`);
            }
        });
    });
});
//# sourceMappingURL=Job.test.js.map