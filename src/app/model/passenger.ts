import { Address } from "./address";

export interface Passenger {
    id: number;
    name: string;
    firstName: string;
    bonusMiles: number;
    status: string;
    address: Address;
}
