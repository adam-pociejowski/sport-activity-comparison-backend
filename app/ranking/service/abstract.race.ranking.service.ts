import { PlayerEvent } from "../../simulate/model/event/player.event.model";
import { RankingItemRaceEvent } from "../model/race/ranking.item.race.event";
import { RankingItemRaceEventType } from "../model/race/ranking.item.race.event.type";
import { Country } from "../../core/model/country.enum";
import { ActivityType } from "../model/activity/activity.type.enum";
import { RaceRider } from "../../simulate/model/config/race.rider.model";
import { NpcRiderEvent } from "../../simulate/model/event/npc.rider.event.model";
import { RaceRankingItem } from "../model/race/race.ranking.item.model";
import {ActivityRankingItem} from "../model/activity/activity.ranking.item.model";

export abstract class AbstractRaceRankingService {

    protected prepareRaceRidersMap = (raceRiders: RaceRider[]) => {
        let raceRidersMap = new Map<string, RaceRider>();
        raceRiders
            .forEach((raceRider: RaceRider) => raceRidersMap.set(raceRider.rider.riderId, raceRider));
        return raceRidersMap;
    }

    protected pushPlayerItem = (playerEvent: PlayerEvent) => {
        return [
            new RaceRankingItem(
                new RankingItemRaceEvent(
                    'PLAYER',
                    RankingItemRaceEventType.USER_ACTIVITY,
                    0.9,
                    Country.POL
                ),
                ActivityType.OUTDOOR_RIDE,
                playerEvent.time
            )
        ];
    }

    protected pushNpcRankingItems = (raceRidersMap: Map<string, RaceRider>, npcEvents: NpcRiderEvent[]) =>
        npcEvents
            .map((npcEvent: NpcRiderEvent) => {
                let rider = raceRidersMap.get(npcEvent.riderId)!.rider;
                return new RaceRankingItem(
                    new RankingItemRaceEvent(
                        `${rider.firstName.substring(0,1)}. ${rider.lastName}`,
                        RankingItemRaceEventType.NPC,
                        npcEvent.power,
                        rider.country
                    ),
                    ActivityType.OUTDOOR_RIDE,
                    npcEvent.time);
            });

    protected mapToActivityRankingItem = (rankingItem: RaceRankingItem) =>
        new ActivityRankingItem<RankingItemRaceEvent>(
            rankingItem.info,
            rankingItem.activityType,
            rankingItem.timeInSec
        );
}