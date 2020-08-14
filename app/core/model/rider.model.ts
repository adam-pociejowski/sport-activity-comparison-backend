import { RiderAbilities } from "./rider.abilities.model";
import { Country } from "../enums/country.enum";

export class Rider {
    constructor(public riderId: string,
                public firstName: string,
                public lastName: string,
                public country: Country,
                public abilities: RiderAbilities) {}
}