import { InitRaceRequest } from "../model/init.race.request.model";
import { v4 as uuidv4 } from "uuid";
import { Rider } from "../../core/model/rider.model";
import { RidersService } from "../../core/service/riders.service";
import { RaceConfiguration } from "../../core/model/race.configuration.model";
import { Stage } from "../../core/model/stage.model";
import { ActivityType } from "../../core/enums/activity.type.enum";
import { RaceRider } from "../../core/model/race.rider.model";
import { RaceUtils } from "../util/race.utils";
import { RaceConfigurationService } from "../../core/service/race.configuration.service";

export class RaceInitService {
    public static INSTANCE = new RaceInitService();
    private constructor() {}

    public init = async (req: InitRaceRequest) =>
        this.saveConfiguration(req, (
            await RidersService
                .INSTANCE
                .findByLimit(req.ridersAmount)));

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