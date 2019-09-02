import { Period } from "./period";

export interface Rentable {
    name: string;
    period: Period;
    dayPrice: number; // want to make this time agnostic, it shouldn't matter if it's a day price or timeprice or something else. It should depend on the choice of the user.
    calculateCost(): number;
}