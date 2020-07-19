import {InitRaceRequest} from "../model/request/init.race.request.model";
import {MongoModelService} from "../../mongo/service/mongo.model.service";
import {Schema} from "mongoose";
import {RaceConfiguration} from "../model/config/race.configuration.model";
import {v4 as uuidv4} from 'uuid';
import {Stage} from "../model/config/stage.model";
import {ActivityType} from "../../activity/model/activity.type.enum";
import {RaceRider} from "../model/config/race.rider.model";
import {Rider} from "../model/config/rider.model";
import {Country} from "../../core/model/country.enum";
import {RiderAbilities} from "../model/config/rider.abilities.model";

export class InitRaceService extends MongoModelService {
    constructor() {
        super('race-configurations', InitRaceService.getSchema());
    }

    execute = async (param: InitRaceRequest) => {
        let raceId = uuidv4();
        let config = await this.MongoModel(
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
                [
                    new RaceRider(
                        new Rider(
                            'Alejandro',
                            'Valverde',
                            Country.ESP,
                            new RiderAbilities(75, 81, 82, 74)),
                        0.8
                    ),
                    new RaceRider(
                        new Rider(
                            'Michał',
                            'Kwiatkowski',
                            Country.POL,
                            new RiderAbilities(78, 76, 82, 78)),
                        0.8
                    )
                ]
            )).save();
        console.log(config);
        return config;
    }

    private static getSchema = () =>
        new Schema({
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