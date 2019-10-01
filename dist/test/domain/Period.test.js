"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const period_1 = require("../../src/domain/job/period");
describe('Period', () => {
    describe('getDays', () => {
        it('should give the correct nr of days worked', () => {
            const startDate = new Date('04/20/2019');
            const endDate = new Date('04/30/2019');
            const period = new period_1.Period(startDate, endDate);
            const days = period.getDays();
            if (days !== 11) {
                throw new Error(`Incorrect number of days returned. Expected: 11, got: ${days}`);
            }
        });
    });
});
//# sourceMappingURL=Period.test.js.map