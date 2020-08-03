export class ActivityRankingItem<T> {
    constructor(public readonly info: T,
                public readonly activityType: string,
                public readonly timeInSec: number) {}
}
