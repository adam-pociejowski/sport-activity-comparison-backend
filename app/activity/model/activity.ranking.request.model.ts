import { ActivityType } from "./activity.type.enum";

export class ActivityRankingRequest {
    constructor(public activityType: ActivityType,
                public distance: number) {}
}