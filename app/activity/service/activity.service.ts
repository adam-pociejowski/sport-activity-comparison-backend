import { MongoModelService } from "../../mongo/service/mongo.model.service";
import { Schema } from "mongoose";

export abstract class ActivityService extends MongoModelService {
    protected constructor() {
        super(
            'activity',
            new Schema({
                id: String,
                name: String,
                distance: Number,
                movingTime: Number,
                elapsedTime: Number,
                type: String,
                averageSpeed: Number,
                maxSpeed: Number,
                startDate: Date,
                track: [
                    {
                        location: {
                            lat: Number,
                            lng: Number
                        },
                        time: Number,
                        distance: Number,
                        velocity: Number
                    }
                ]
            }));
    }
}
