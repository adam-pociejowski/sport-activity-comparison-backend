import { UpdateRaceRequest } from "../model/request/update.race.request.model";
import { RaceConfigurationService } from "./race.configuration.service";
import { RaceConfiguration } from "../model/config/race.configuration.model";
import { RaceRider } from "../model/config/race.rider.model";
import { ActivityRankingConverter } from "../../activity/converter/activity.ranking.converter";
import { RaceEventService } from "./race.event.service";
import { SimulateRaceStrategyFactory } from "../strategy/simulate.race.strategy.factory";

export class UpdateRaceService {
    public static INSTANCE = new UpdateRaceService();
    private constructor() {}

    updateRaceState = async (request: UpdateRaceRequest) => {
        console.log(request);
        let raceConfig: RaceConfiguration = await this.findRaceConfig(request.raceId);
        let raceEvent = SimulateRaceStrategyFactory
            .fromRaceMode(raceConfig.raceMode)
            .simulate(raceConfig, request);
        RaceEventService
            .INSTANCE
            .save(raceEvent);
        return ActivityRankingConverter.fromRaceEvent(this.prepareRaceRidersMap(raceConfig.riders), raceEvent);
    };

    public prepareRaceRidersMap = (raceRiders: RaceRider[]) => {
        let raceRidersMap = new Map<string, RaceRider>();
        raceRiders
            .forEach((raceRider: RaceRider) => raceRidersMap.set(raceRider.rider.riderId, raceRider));
        return raceRidersMap;
    }

    private findRaceConfig = (raceId: string) =>
        RaceConfigurationService
            .INSTANCE
            .findByFilter({"raceId": raceId})
            .then((configs: RaceConfiguration[]) => configs[0]);
}