import { Period } from "./period";

export interface Rentable {
    period: Period;
    dayPrice: number;
    calculateCost(): number;
}