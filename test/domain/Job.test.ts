import { Job } from "../../src/domain/invoice/job/job";
import { JobID } from "../../src/domain/invoice/job/jobID";
import { Cameraman } from "../../src/domain/invoice/job/cameraman";
import { EquipmentItem } from "../../src/domain/invoice/job/equipmentItem";
import { Period } from "../../src/domain/invoice/job/period";

describe('Job', () => {

    let job: Job;

    before(() => {
        const startDate = new Date('04/20/2019');
        const endDate = new Date('04/30/2019');
        const period = new Period(startDate, endDate);

        job = new Job(
            new JobID('123'),
            'Filming a play',
            'Milan',
            'Mike',
            undefined,
            new Cameraman('bob', 'baker', 500.30, period),
            [
                new EquipmentItem('Camera', 300.31, period),
                new EquipmentItem('Slider', 40.68, period)
            ]
        );
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