import { UpdateRaceRequest } from "../model/request/update.race.request.model";
import { MongoModelService } from "../../mongo/service/mongo.model.service";
import { Schema } from "mongoose";

export class UpdateRaceService extends MongoModelService<any> {
    constructor() {
        super('race-events', new Schema({
            raceId: String,
            stageId: String,
            date: Date,
            distance: Number,
            playerEvent: {
                location: {
                    lat: Number,
                    lng: Number,
                    alt: Number
                },
                velocity: Number,
                position: Number,
                time: Number
            },
            npcEvents: [
                {
                    riderId: String,
                    position: Number,
                    time: Number,
                    velocity: Number,
                    currentCondition: Number
                }
            ]
        }));
    }

    mapToObject = (data: any) => '';

    execute = (param: UpdateRaceRequest) =>
        new Promise((resolve) => {
            resolve();
        });


}