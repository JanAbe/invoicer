"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fullName_1 = require("../../src/domain/fullName");
describe('FullName', function () {
    describe('constructor', function () {
        it('should create a new fullName object', function () {
            var firstName = 'tom';
            var lastName = 'bicycle';
            var result = new fullName_1.FullName(firstName, lastName);
            if (result.firstName !== firstName) {
                throw new Error("Fistname not correctly set. Expected: " + firstName + ", got: " + result.firstName);
            }
            if (result.lastName !== lastName) {
                throw new Error("Lastname not correctly set. Expected: " + lastName + ", got: " + result.lastName);
            }
        });
    });
    describe('setFirstName', function () {
        it('should trim the input', function () {
            var firstName = '   tom ';
            var lastName = ' bicycle ';
            var result = new fullName_1.FullName(firstName, lastName);
            if (result.firstName !== 'tom') {
                throw new Error("Fistname not correctly set. Expected: tom, got: " + result.firstName);
            }
            if (result.lastName !== 'bicycle') {
                throw new Error("Lastname not correctly set. Expected: bicycle, got: " + result.lastName);
            }
        });
    });
});
