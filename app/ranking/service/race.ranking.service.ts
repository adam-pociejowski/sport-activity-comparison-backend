import { RaceEvent } from "../../simulate/model/race.event.model";
import { RaceConfiguration } from "../../core/model/race.configuration.model";
import { ActivityRanking } from "../model/activity.ranking.model";
import { RankingItemRaceEvent } from "../model/ranking.item.race.event";
import { RankingType } from "../enums/ranking.type";
import { RaceStatus } from "../../core/enums/race.status";

export interface RaceRankingService {
    generate(raceEvent: RaceEvent, status: RaceStatus, config: RaceConfiguration): Promise<ActivityRanking<RankingItemRaceEvent>>;
    getRankingType(): RankingType;
}