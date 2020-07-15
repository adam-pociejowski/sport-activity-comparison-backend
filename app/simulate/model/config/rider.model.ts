import { RiderAbilities } from "./rider.abilities.model";

export class Rider {
    constructor(public firstName: string,
                public lastName: string,
                public country: string,
                public abilities: RiderAbilities) {}
}