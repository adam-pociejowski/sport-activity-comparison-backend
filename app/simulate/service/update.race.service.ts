import { UpdateRaceRequest } from "../model/update.race.request.model";
import { RaceConfigurationService } from "../../core/service/race.configuration.service";
import { RaceConfiguration } from "../../core/model/race.configuration.model";
import { RaceEventService } from "../../core/service/race.event.service";
import { NPCSimulateRaceService } from "./npc.simulate.race.service";
import { RaceRankingServiceFactory } from "../../ranking/service/race.ranking.service.factory";
import { RaceStatus} from "../../core/enums/race.status";
import { RaceUtils} from "../util/race.utils";
import { RankingType} from "../../ranking/enums/ranking.type";
import { RaceEvent} from "../model/race.event.model";

export class UpdateRaceService {
    public static INSTANCE = new UpdateRaceService();
    private constructor() {}

    startStage = async (raceId: string, stageId: string) => {
        await RaceConfigurationService.INSTANCE.updateRaceStatus(raceId, RaceStatus.IN_PROGRESS);
        await RaceConfigurationService.INSTANCE.updateStageStatus(raceId, stageId, RaceStatus.IN_PROGRESS);
    }

    updateRaceState = async (req: UpdateRaceRequest) => {
        try {
            let config: RaceConfiguration = await this.findRaceConfig(req.raceId);
            let stage = RaceUtils.findStage(config, req.stageId);
            if (stage.status !== RaceStatus.FINISHED) {
                let event = await NPCSimulateRaceService.INSTANCE.simulate(config, stage, req);
                RaceEventService.INSTANCE.save(event);
                if (event.distance >= stage.distance) {
                    await RaceConfigurationService
                        .INSTANCE
                        .updateStageStatus(req.raceId, stage.stageId, RaceStatus.FINISHED);
                    return this.generateRanking(req.rankingType, RaceStatus.FINISHED, config, event);
                }
                return this.generateRanking(req.rankingType, RaceStatus.IN_PROGRESS, config, event);
            }
            throw new Error(`Stage already finished. Race: ${req.raceId}, stage: ${req.stageId}`);
        } catch (e) {
            console.log(e);
            throw e;
        }
    };

    private generateRanking = (rankingType: RankingType,
                               status: RaceStatus,
                               config: RaceConfiguration,
                               event: RaceEvent) =>
        RaceRankingServiceFactory
            .fromRankingType(rankingType)
            .generate(event, status, config);

    private findRaceConfig = (raceId: string) =>
        RaceConfigurationService
            .INSTANCE
            .findByFilter({"raceId": raceId})
            .then((configs: RaceConfiguration[]) => configs[0]);
}