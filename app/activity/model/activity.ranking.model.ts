import { ActivityRankingItem } from "./activity.ranking.item.model";

export class ActivityRanking {
    constructor(public readonly ranking: ActivityRankingItem[] | void,
                public readonly distance: number,
                public readonly activityType: string) {}
}