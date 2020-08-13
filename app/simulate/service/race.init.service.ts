import { InitRaceRequest } from "../model/request/init.race.request.model";
import { v4 as uuidv4 } from "uuid";
import { Rider } from "../model/config/rider.model";
import { RidersService } from "../../core/service/riders.service";
import { RaceConfiguration } from "../model/config/race.configuration.model";
import { Stage } from "../model/config/stage.model";
import { ActivityType } from "../../ranking/model/activity/activity.type.enum";
import { RaceRider } from "../model/config/race.rider.model";
import { RaceUtils } from "../util/race.utils";
import { RaceConfigurationService } from "../../core/service/race.configuration.service";

export class RaceInitService {
    public static INSTANCE = new RaceInitService();
    private constructor() {}

    public init = async (req: InitRaceRequest) => {
        console.log(`[INIT_RACE]: ${req}`);
        return this.saveConfiguration(req, (
            await RidersService
                .INSTANCE
                .findByLimit(req.ridersAmount)));
    }

    private saveConfiguration = (param: InitRaceRequest, riders: Rider[]) => {
        let raceId = uuidv4();
        return RaceConfigurationService
            .INSTANCE
            .save(
                new RaceConfiguration(
                    raceId,
                    param.name,
                    new Date(),
                    null,
                    null,
                    param.difficulty,
                    param.riderCurrentConditionVariability,
                    param.maxRiderCurrentConditionChangePerEvent,
                    param.randomFactorVariability,
                    param.resultsScattering,
                    param
                        .stages
                        .map((stage: Stage) =>
                            new Stage(
                                `${raceId}_${uuidv4()}`,
                                stage.distance,
                                stage.abilitiesFactor,
                                ActivityType.OUTDOOR_RIDE)),
                    riders
                        .map((rider: Rider) =>
                            new RaceRider(rider, RaceUtils.randomDouble(1.0 - param.riderRaceConditionVariability, 1.0)))
                ));
    }
}