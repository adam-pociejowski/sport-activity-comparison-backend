import { RaceRider } from "./race.rider.model";
import { Stage } from "./stage.model";

export class RaceConfiguration {
    constructor(public raceId: string,
                public name: string,
                public generateDate: Date,
                public startDate: Date | null,
                public finishDate: Date | null,
                public showOwnResults: boolean,
                public difficulty: number,
                public riderCurrentConditionVariability: number,
                public maxRiderCurrentConditionChangePerEvent: number,
                public randomFactorVariability: number,
                public resultsScattering: number,
                public stages: Stage[],
                public riders: RaceRider[]) {}
}