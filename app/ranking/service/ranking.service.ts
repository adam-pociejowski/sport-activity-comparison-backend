import { RankingType } from "../enums/ranking.type";
import { RaceConfigurationService } from "../../core/service/race.configuration.service";
import { RaceConfiguration } from "../../core/model/race.configuration.model";
import { RaceUtils } from "../../simulate/util/race.utils";
import { RaceRankingServiceFactory } from "./race.ranking.service.factory";
import { RaceStatus } from "../../core/enums/race.status";

export class RankingService {
    public static INSTANCE = new RankingService();

    private constructor() {}

    getRanking = async (raceId: string, stageId: string, rankingType: RankingType) => {
        let config = await RaceConfigurationService
            .INSTANCE
            .findByFilter({"raceId": raceId})
            .then((configs: RaceConfiguration[]) => configs[0]);
        let event = await RaceUtils.getLastEvent(raceId, stageId);
        return RaceRankingServiceFactory
            .fromRankingType(rankingType)
            .generate(event, RaceStatus.IN_PROGRESS, config);
    }
}