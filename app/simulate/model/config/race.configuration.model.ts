import { RaceRider } from "./race.rider.model";
import { Stage } from "./stage.model";

export class RaceConfiguration {
    constructor(public raceId: string,
                public name: string,
                public generateDate: Date,
                public startDate: Date,
                public finishDate: Date,
                public showOwnResults: boolean,
                public difficulty: number,
                public stages: Stage[],
                public riders: RaceRider[]) {}
}