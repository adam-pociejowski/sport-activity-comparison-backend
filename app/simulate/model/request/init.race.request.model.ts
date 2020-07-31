import { ActivityType } from "../../../activity/model/activity.type.enum";

export class InitRaceRequest {
    constructor(public name: string,
                public difficulty: number,
                public stagesDistance: number[],
                public ridersAmount: number,
                public showMyResults: boolean,
                public activityType: ActivityType,
                public raceConditionMin: number,
                public raceConditionMax: number) {}
}