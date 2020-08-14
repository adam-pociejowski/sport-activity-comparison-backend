import { UpdateRaceRequest } from "../model/update.race.request.model";
import { RaceConfigurationService } from "../../core/service/race.configuration.service";
import { RaceConfiguration } from "../../core/model/race.configuration.model";
import { RaceEventService } from "../../core/service/race.event.service";
import { NPCSimulateRaceService } from "./npc.simulate.race.service";
import { RaceRankingServiceFactory } from "../../ranking/service/race.ranking.service.factory";

export class UpdateRaceService {
    public static INSTANCE = new UpdateRaceService();
    private constructor() {}

    updateRaceState = async (req: UpdateRaceRequest) => {
        try {
            // console.log(req);
            let config: RaceConfiguration = await this.findRaceConfig(req.raceId);
            let event = await NPCSimulateRaceService.INSTANCE.simulate(config, req);
            RaceEventService.INSTANCE.save(event);
            return RaceRankingServiceFactory
                .fromRankingType(req.rankingType)
                .generate(event, config);
        } catch (e) {
            console.log(e);
            throw e;
        }
    };

    private findRaceConfig = (raceId: string) =>
        RaceConfigurationService
            .INSTANCE
            .findByFilter({"raceId": raceId})
            .then((configs: RaceConfiguration[]) => configs[0]);
}