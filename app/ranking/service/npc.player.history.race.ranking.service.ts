import { RaceEvent } from "../../simulate/model/race.event.model";
import { RankingItemRaceEvent } from "../model/ranking.item.race.event";
import { ActivityRanking } from "../model/activity.ranking.model";
import { RaceRankingService } from "./race.ranking.service";
import { RaceConfiguration } from "../../core/model/race.configuration.model";
import { AbstractRaceRankingService } from "./abstract.race.ranking.service";
import { RaceRankingItem } from "../model/race.ranking.item.model";
import { RankingType } from "../enums/ranking.type";
import { RaceUserHistoryService } from "../../history/service/race.user.history.service";
import { Stage } from "../../core/model/stage.model";
import { UserRankingRequest } from "../../history/model/user.ranking.request.model";
import { RaceStatus } from "../../core/enums/race.status";

export class NPCPlayerHistoryRaceRankingService extends AbstractRaceRankingService implements RaceRankingService {
    public static INSTANCE = new NPCPlayerHistoryRaceRankingService();
    private constructor() {
        super();
    }

    public generate = async (event: RaceEvent, status: RaceStatus, cfg: RaceConfiguration) =>
        new ActivityRanking<RankingItemRaceEvent>(
            new Array<RaceRankingItem>()
                .concat(this.pushPlayerItem(event.playerEvent))
                .concat(this.pushNpcRankingItems(this.prepareRaceRidersMap(cfg.riders), event.npcEvents))
                .concat((await this.pushPlayerHistoryItems(event.distance, cfg.stages.find((s: Stage) => s.stageId == event.stageId)!)))
                .map((rankingItem: RaceRankingItem) => this.mapToActivityRankingItem(rankingItem)),
            status,
            event.distance);

    private pushPlayerHistoryItems = (distance: number, stage: Stage) =>
        RaceUserHistoryService
            .INSTANCE
            .find(new UserRankingRequest(
                stage.activityType,
                distance,
                stage.distance));

    getRankingType = () => RankingType.PLAYER_NPC_WITH_HISTORY;
}
