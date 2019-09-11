"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var period_1 = require("../../src/domain/period");
describe('Period', function () {
    describe('getDays', function () {
        it('should give the correct nr of days worked', function () {
            var startDate = new Date('04/20/2019');
            var endDate = new Date('04/30/2019');
            var period = new period_1.Period(startDate, endDate);
            var days = period.getDays();
            if (days !== 11) {
                throw new Error("Incorrect number of days returned. Expected: 11, got: " + days);
            }
        });
    });
});
//# sourceMappingURL=Period.test.js.map