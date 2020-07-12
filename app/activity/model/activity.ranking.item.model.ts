export class ActivityRankingItem {
    constructor(public readonly position: number,
                public readonly activityName: string,
                public readonly stravaActivityType: string,
                public readonly timeInSec: number,
                public readonly avgSpeed: number,
                public readonly date: string) {}
}
