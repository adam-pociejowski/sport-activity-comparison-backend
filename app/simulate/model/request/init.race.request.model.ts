import { ActivityType } from "../../../activity/model/activity.type.enum";
import { Stage } from "../config/stage.model";

export class InitRaceRequest {
    constructor(public name: string,
                public difficulty: number,
                public stages: Stage[],
                public ridersAmount: number,
                public showMyResults: boolean,
                public activityType: ActivityType,
                public riderRaceConditionVariability: number,
                public riderCurrentConditionVariability: number,
                public maxRiderCurrentConditionChangePerEvent: number,
                public randomFactorVariability: number,
                public resultsScattering: number) {}
}