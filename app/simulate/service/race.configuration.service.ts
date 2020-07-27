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

export class RaceConfigurationService extends MongoModelService<any> {
    public static INSTANCE = new RaceConfigurationService();
    private constructor() {
        super('race-configurations', RaceConfigurationService.getSchema());
    }

    initRace = async (param: InitRaceRequest) => {
        let raceId = uuidv4();
        let riders: Rider[] = await RidersService.INSTANCE.findAll();
        return this.save(
            new RaceConfiguration(
                raceId,
                '',
                new Date(),
                null,
                null,
                param.showMyResults,
                param.difficulty,
                param.stagesDistance.map((distance: number) =>
                    new Stage(`${raceId}_${uuidv4()}`, distance, ActivityType.OUTDOOR_RIDE)),
                riders.map((rider: Rider) => new RaceRider(rider, 0.8))
            ));
    }

    mapToObject = (data: any) =>
        new RaceConfiguration(
            data.raceId,
            data.name,
            data.generateDate,
            data.startDate,
            data.finishDate,
            data.showOwnResults,
            data.difficulty,
            data.stages.map((stage: any) =>
                new Stage(
                    stage.stageId,
                    stage.distance,
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
            showOwnResults: Boolean,
            difficulty: Number,
            stages: [
                {
                    stageId: String,
                    distance: Number,
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