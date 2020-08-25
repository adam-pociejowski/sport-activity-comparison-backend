import { RankingItemRaceEvent } from "../model/ranking.item.race.event";
import { RankingItemRaceEventType } from "../enums/ranking.item.race.event.type";
import { Country } from "../../core/enums/country.enum";
import { ActivityType } from "../../core/enums/activity.type.enum";
import { RaceRider } from "../../core/model/race.rider.model";
import { NpcRiderEvent } from "../../simulate/model/npc.rider.event.model";
import { RaceRankingItem } from "../model/race.ranking.item.model";
import { ActivityRankingItem } from "../model/activity.ranking.item.model";

export abstract class AbstractRaceRankingService {

    protected prepareRaceRidersMap = (raceRiders: RaceRider[]) => {
        let raceRidersMap = new Map<string, RaceRider>();
        raceRiders
            .forEach((raceRider: RaceRider) => raceRidersMap.set(raceRider.rider.riderId, raceRider));
        return raceRidersMap;
    }

    protected pushPlayerItem = (time: number) => {
        return [
            new RaceRankingItem(
                new RankingItemRaceEvent(
                    'PLAYER',
                    RankingItemRaceEventType.USER_ACTIVITY,
                    0.9,
                    Country.POL
                ),
                ActivityType.OUTDOOR_RIDE,
                time
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