import { ActivityRankingItem } from "./activity.ranking.item.model";
import { RaceStatus } from "../../core/enums/race.status";

export class ActivityRanking<T> {
    constructor(public readonly ranking: ActivityRankingItem<T>[] | void,
                public readonly status: RaceStatus,
                public readonly distance: number) {}
}