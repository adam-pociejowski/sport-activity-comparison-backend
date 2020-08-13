import { ActivityType } from "../../../ranking/model/activity/activity.type.enum";
import { Stage } from "../config/stage.model";

export class InitRaceRequest {
    constructor(public name: string,
                public difficulty: number,
                public stages: Stage[],
                public ridersAmount: number,
                public activityType: ActivityType,
                public riderRaceConditionVariability: number,
                public riderCurrentConditionVariability: number,
                public maxRiderCurrentConditionChangePerEvent: number,
                public randomFactorVariability: number,
                public resultsScattering: number) {}
}