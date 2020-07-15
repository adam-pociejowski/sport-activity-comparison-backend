import { InitRaceRequest } from "../model/request/init.race.request.model";
import { MongoModelService } from "../../mongo/service/mongo.model.service";
import { Schema } from "mongoose";

export class InitRaceService extends MongoModelService {
    constructor() {
        super('race-configurations', new Schema({
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
                    type: String
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
        }));
    }

    execute = (param: InitRaceRequest) =>
        new Promise((resolve) => {
            resolve();
        });
}