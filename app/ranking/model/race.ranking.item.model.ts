import { RankingItemRaceEvent } from "./ranking.item.race.event";
import { ActivityType } from "../../core/enums/activity.type.enum";

export class RaceRankingItem {
    constructor(public info: RankingItemRaceEvent,
                public activityType: ActivityType,
                public timeInSec: number) {}
}