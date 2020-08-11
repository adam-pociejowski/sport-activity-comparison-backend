import { ActivityType } from "../../../activity/model/activity.type.enum";
import { Stage } from "../config/stage.model";
import { RaceMode } from "../config/race.mode";

export class InitRaceRequest {
    constructor(public name: string,
                public difficulty: number,
                public stages: Stage[],
                public ridersAmount: number,
                public raceMode: RaceMode,
                public activityType: ActivityType,
                public riderRaceConditionVariability: number,
                public riderCurrentConditionVariability: number,
                public maxRiderCurrentConditionChangePerEvent: number,
                public randomFactorVariability: number,
                public resultsScattering: number) {}
}