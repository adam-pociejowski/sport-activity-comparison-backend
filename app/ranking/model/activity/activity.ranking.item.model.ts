import { ActivityType } from "./activity.type.enum";

export class ActivityRankingItem<T> {
    constructor(public readonly info: T,
                public readonly activityType: ActivityType,
                public readonly timeInSec: number) {}
}
