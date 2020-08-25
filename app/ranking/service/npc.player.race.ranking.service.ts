import { RaceEvent } from "../../simulate/model/race.event.model";
import { RankingItemRaceEvent } from "../model/ranking.item.race.event";
import { ActivityRanking } from "../model/activity.ranking.model";
import { RaceRankingService } from "./race.ranking.service";
import { RaceConfiguration } from "../../core/model/race.configuration.model";
import { AbstractRaceRankingService } from "./abstract.race.ranking.service";
import { RaceRankingItem } from "../model/race.ranking.item.model";
import { RankingType } from "../enums/ranking.type";
import { RaceStatus } from "../../core/enums/race.status";

export class NPCPlayerRaceRankingService extends AbstractRaceRankingService implements RaceRankingService {
    public static INSTANCE = new NPCPlayerRaceRankingService();
    private constructor() {
        super();
    }

    public generate = (raceEvent: RaceEvent, status: RaceStatus, config: RaceConfiguration) =>
        Promise
            .resolve(
                new ActivityRanking<RankingItemRaceEvent>(
                    new Array<RaceRankingItem>()
                        .concat(this.pushPlayerItem(raceEvent.playerEvent.time))
                        .concat(this.pushNpcRankingItems(this.prepareRaceRidersMap(config.riders), raceEvent.npcEvents))
                        .map((rankingItem: RaceRankingItem) => this.mapToActivityRankingItem(rankingItem)),
                    status,
                    raceEvent.distance));

    getRankingType = () => RankingType.PLAYER_NPC;
}
