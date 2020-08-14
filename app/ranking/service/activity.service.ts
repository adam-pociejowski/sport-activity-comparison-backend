import { Activity } from "../../core/model/activity.model";
import { Schema } from "mongoose";
import { ActivityTrackPoint } from "../../core/model/activity.track.point.model";
import { LocationData } from "../../core/model/location.model";
import { MongoModelService } from "../../core/service/mongo.model.service";

export class ActivityService extends MongoModelService<Activity> {
    public static INSTANCE = new ActivityService();
    private constructor() {
        super('activity', ActivityService.getSchema());
    }

    mapToObject = (data: any) =>
        new Activity(
            data.id,
            data.name,
            data.distance,
            data.movingTime,
            data.elapsedTime,
            data.type,
            data.averageSpeed,
            data.maxSpeed,
            new Date(data.startDate),
            data.track
                .map((track: any) =>
                    new ActivityTrackPoint(
                        new LocationData(
                            track.location.lat,
                            track.location.lng,
                            0.0,
                            0.0
                        ),
                        track.time,
                        track.distance,
                        track.velocity)));

    private static getSchema () {
        return new Schema({
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
        });
    }
}