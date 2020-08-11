import { InitRaceRequest } from "../model/request/init.race.request.model";
import { MongoModelService } from "../../mongo/service/mongo.model.service";
import { Schema } from "mongoose";
import { RaceConfiguration } from "../model/config/race.configuration.model";
import { v4 as uuidv4 } from 'uuid';
import { Stage } from "../model/config/stage.model";
import { ActivityType } from "../../activity/model/activity.type.enum";
import { RaceRider } from "../model/config/race.rider.model";
import { Rider } from "../model/config/rider.model";
import { RidersService } from "./riders.service";
import { RaceUtils } from "../util/race.utils";
import { RiderAbilities } from "../model/config/rider.abilities.model";

export class RaceConfigurationService extends MongoModelService<any> {
    public static INSTANCE = new RaceConfigurationService();
    private constructor() {
        super('race-configurations', RaceConfigurationService.getSchema());
    }

    initRace = async (param: InitRaceRequest) => {
        console.log(param);
        let raceId = uuidv4();
        let riders: Rider[] = await RidersService
            .INSTANCE
            .findByLimit(param.ridersAmount);
        return this.save(
            new RaceConfiguration(
                raceId,
                param.name,
                new Date(),
                null,
                null,
                param.raceMode,
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

    mapToObject = (data: any) =>
        new RaceConfiguration(
            data.raceId,
            data.name,
            data.generateDate,
            data.startDate,
            data.finishDate,
            data.raceMode,
            data.difficulty,
            data.riderCurrentConditionVariability,
            data.maxRiderCurrentConditionChangePerEvent,
            data.randomFactorVariability,
            data.resultsScattering,
            data.stages.map((stage: any) =>
                new Stage(
                    stage.stageId,
                    stage.distance,
                    new RiderAbilities(
                        stage.abilitiesFactor.flat,
                        stage.abilitiesFactor.mountain,
                        stage.abilitiesFactor.hill,
                        stage.abilitiesFactor.timeTrial
                    ),
                    stage.activityType)),
            data.riders.map((raceRider: any) =>
                new RaceRider(
                    RidersService.INSTANCE.mapToObject(raceRider.rider),
                    raceRider.raceCondition
                )));

    private static getSchema() {
        return new Schema({
            raceId: String,
            name: String,
            generateDate: Date,
            startDate: Date,
            finishDate: Date,
            raceMode: String,
            difficulty: Number,
            riderCurrentConditionVariability: Number,
            maxRiderCurrentConditionChangePerEvent: Number,
            randomFactorVariability: Number,
            resultsScattering: Number,
            stages: [
                {
                    stageId: String,
                    distance: Number,
                    abilitiesFactor: {
                        flat: Number,
                        mountain: Number,
                        hill: Number,
                        timeTrial: Number
                    },
                    activityType: String
                }
            ],
            riders: [
                {
                    rider: {
                        riderId: String,
                        firstName: String,
                        lastName: String,
                        country: String,
                        abilities: {
                            flat: Number,
                            mountain: Number,
                            hill: Number,
                            timeTrial: Number
                        }
                    },
                    raceCondition: Number
                }
            ]
        })
    }
}