import { ActivityRankingItem } from "./activity.ranking.item.model";

export class ActivityRanking<T> {
    constructor(public readonly ranking: ActivityRankingItem<T>[] | void,
                public readonly distance: number) {}
}