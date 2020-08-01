export class ActivityRankingItem<T> {
    constructor(public readonly position: number,
                public readonly info: T,
                public readonly activityType: string,
                public readonly timeInSec: number) {}
}
