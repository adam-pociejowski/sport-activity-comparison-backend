import { RaceEvent } from "../../simulate/model/event/race.event.model";
import { RaceConfiguration } from "../../simulate/model/config/race.configuration.model";
import { ActivityRanking } from "../model/activity/activity.ranking.model";
import { RankingItemRaceEvent } from "../model/race/ranking.item.race.event";
import { RankingType } from "../model/race/ranking.type";

export interface RaceRankingService {
    generate(raceEvent: RaceEvent, config: RaceConfiguration): ActivityRanking<RankingItemRaceEvent>;
    getRankingType(): RankingType;
}