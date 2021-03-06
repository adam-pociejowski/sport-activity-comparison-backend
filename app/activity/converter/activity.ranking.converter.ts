import { RaceEvent } from "../../simulate/model/event/race.event.model";
import { NpcRiderEvent } from "../../simulate/model/event/npc.rider.event.model";
import { RankingItemRaceEvent } from "../../simulate/model/ranking/ranking.item.race.event";
import { RaceRider } from "../../simulate/model/config/race.rider.model";
import { RankingItemRaceEventType } from "../../simulate/model/ranking/ranking.item.race.event.type";
import { Country } from "../../core/model/country.enum";
import { PlayerEvent } from "../../simulate/model/event/player.event.model";
import { ActivityRankingItem } from "../model/activity.ranking.item.model";
import { ActivityRanking } from "../model/activity.ranking.model";
import { ActivityType } from "../model/activity.type.enum";

export class ActivityRankingConverter {
    public static fromRaceEvent = (raceRidersMap: Map<string, RaceRider>,
                                   raceEvent: RaceEvent) =>
        new ActivityRanking(
            ActivityRankingConverter
                .appendPlayerRankingItem(
                    ActivityRankingConverter
                        .mapNpcRankingItems(raceRidersMap, raceEvent.npcEvents), raceEvent.playerEvent)
                .map((rankingItem: RankingItem) =>
                    new ActivityRankingItem<RankingItemRaceEvent>(
                        rankingItem.info,
                        rankingItem.activityType,
                        rankingItem.timeInSec
                    )),
            raceEvent.distance);

    private static appendPlayerRankingItem = (rankingItems: RankingItem[],
                                              playerEvent: PlayerEvent) => {
        rankingItems.push(new RankingItem(
            new RankingItemRaceEvent(
                'PLAYER',
                RankingItemRaceEventType.USER_ACTIVITY,
                0.9,
                Country.POL
            ),
            ActivityType.OUTDOOR_RIDE,
            playerEvent.time));
        return rankingItems;
    }

    private static mapNpcRankingItems = (raceRidersMap: Map<string, RaceRider>,
                                         npcEvents: NpcRiderEvent[]) =>
        npcEvents
            .map((npcEvent: NpcRiderEvent) => {
                let rider = raceRidersMap.get(npcEvent.riderId)!.rider;
                return new RankingItem(
                    new RankingItemRaceEvent(
                        `${rider.firstName.substring(0,1)}. ${rider.lastName}`,
                        RankingItemRaceEventType.NPC,
                        npcEvent.power,
                        rider.country
                    ),
                    ActivityType.OUTDOOR_RIDE,
                    npcEvent.time);
            });
}

class RankingItem {
    constructor(public info: RankingItemRaceEvent,
                public activityType: ActivityType,
                public timeInSec: number) {}
}