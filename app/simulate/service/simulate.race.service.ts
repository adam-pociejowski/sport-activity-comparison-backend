import { MongoModelService } from "../../mongo/service/mongo.model.service";
import { Schema } from "mongoose";

export abstract class SimulateRaceService<E, T> extends MongoModelService {
    protected constructor() {
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
                    distance: Number,
                    type: String
                }
            ],
            riders: [
                {
                    firstName: String,
                    lastName: String,
                    abilities: {
                        flat: Number,
                        mountain: Number,
                        hill: Number,
                        timeTrial: Number
                    }
                }
            ]
        }));
    }

    public abstract execute(param: E): Promise<T>;
}