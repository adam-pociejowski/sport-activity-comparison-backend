import { RaceEvent } from "../../simulate/model/event/race.event.model";
import { RankingItemRaceEvent } from "../model/race/ranking.item.race.event";
import { ActivityRanking } from "../model/activity/activity.ranking.model";
import { RaceRankingService } from "./race.ranking.service";
import { RaceConfiguration } from "../../simulate/model/config/race.configuration.model";
import { AbstractRaceRankingService } from "./abstract.race.ranking.service";
import { RaceRankingItem } from "../model/race/race.ranking.item.model";
import { RankingType } from "../model/race/ranking.type";

export class NPCPlayerRaceRankingService extends AbstractRaceRankingService implements RaceRankingService {
    public static INSTANCE = new NPCPlayerRaceRankingService();
    private constructor() {
        super();
    }

    public generate = (raceEvent: RaceEvent, config: RaceConfiguration): ActivityRanking<RankingItemRaceEvent> =>
        new ActivityRanking<RankingItemRaceEvent>(
            new Array<RaceRankingItem>()
                .concat(this.pushPlayerItem(raceEvent.playerEvent))
                .concat(this.pushNpcRankingItems(this.prepareRaceRidersMap(config.riders), raceEvent.npcEvents))
                .map((rankingItem: RaceRankingItem) => this.mapToActivityRankingItem(rankingItem)),
            raceEvent.distance);

    getRankingType = () => RankingType.PLAYER_NPC;
}
