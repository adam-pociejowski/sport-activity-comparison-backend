import { ActivityRankingRequest } from "../model/activity.ranking.request.model";
import { ActivityRankingItem } from "../model/activity.ranking.item.model";
import { ActivityType } from "../model/activity.type.enum";
import { MongoModelService } from "../../mongo/service/mongo.model.service";
import { Schema } from "mongoose";
import { ActivityRankingItemInfo } from "../model/activity.ranking.item.info.model";

export class ActivityRankingService extends MongoModelService<any>  {

    constructor() {
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

    getResultRanking = async (request: ActivityRankingRequest) => {
        return this.MongoModel
            .aggregate(this.preparePipeline(request))
            .then((data: any[]) => this.mapToObject(data));
    }

    mapToObject = (obj: any[]) =>
        obj.map((item: any) =>
            new ActivityRankingItem<ActivityRankingItemInfo>(
                obj.indexOf(item) + 1,
                new ActivityRankingItemInfo(item.name, item.startDate),
                item.type,
                item.time));

    private preparePipeline = (request: ActivityRankingRequest) =>
        [
            {
                '$match': this.getMongoMatchQueryBasedOnActivityType(request.activityType)
            },
            {
                '$addFields': {
                    'track': {
                        '$filter': {
                            'input': '$track',
                            'as': 'track',
                            'cond': {
                                '$lte': [
                                    '$$track.distance', request.distance
                                ]
                            }
                        }
                    }
                }
            }, {
            '$addFields': {
                'result': {
                    '$slice': [
                        '$track', -1
                    ]
                }
            }
        }, {
            '$unwind': {
                'path': '$result'
            }
        }, {
            '$match': {
                'result.distance': {
                    '$gt': request.distance - 100
                },
                'result.time': {
                    '$gt': 0
                }
            }
        }, {
            '$project': {
                'time': {
                    '$multiply': [
                        {
                            '$divide': [
                                request.distance, '$result.distance'
                            ]
                        }, '$result.time'
                    ]
                },
                'name': 1,
                'averageSpeed': 1,
                'startDate': 1,
                "type": 1
            }
        }, {
            '$sort': {
                'time': 1
            }
        }];

    private getMongoMatchQueryBasedOnActivityType = (activityType: ActivityType) => {
        switch (activityType) {
            case ActivityType.OUTDOOR_RIDE:
                return {'type': 'Ride'}
            case ActivityType.VIRTUAL_RIDE:
                return {'type': 'VirtualRide'}
            case ActivityType.RIDE:
                return {
                    '$or': [
                        {'type': 'Ride'},
                        {'type': 'VirtualRide'}
                    ]
                }
            case ActivityType.RUN:
                return {'type': 'Run'}
        }
    }
}