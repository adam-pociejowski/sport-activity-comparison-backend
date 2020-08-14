import { ActivityType } from "../../core/enums/activity.type.enum";

export class UserRankingRequest {
    constructor(public activityType: ActivityType,
                public distance: number,
                public fullActivityDistance: number) {}
}