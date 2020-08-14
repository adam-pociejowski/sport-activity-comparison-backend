import { MongoModelService } from "./mongo.model.service";
import { Schema } from "mongoose";
import { RaceConfiguration } from "../model/race.configuration.model";
import { Stage } from "../model/stage.model";
import { RaceRider } from "../model/race.rider.model";
import { RidersService } from "./riders.service";
import { RiderAbilities } from "../model/rider.abilities.model";

export class RaceConfigurationService extends MongoModelService<RaceConfiguration> {
    public static INSTANCE = new RaceConfigurationService();
    private constructor() {
        super('race-configurations', RaceConfigurationService.getSchema());
    }

    mapToObject = (data: any) =>
        new RaceConfiguration(
            data.raceId,
            data.name,
            data.generateDate,
            data.startDate,
            data.finishDate,
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