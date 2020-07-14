import { ActivityRankingRequest } from "../model/activity.ranking.request.model";
import { ActivityService } from "./activity.service";
import { ActivityRankingItem } from "../model/activity.ranking.item.model";
import { ActivityType } from "../model/activity.type.enum";

export class ActivityRankingService extends ActivityService {

    constructor() {
        super();
    }

    getResultRanking = async (request: ActivityRankingRequest) => {
        return this.MongoModel
            .aggregate(this.preparePipeline(request))
            .then((data: any[]) => this.mapToObject(data));
    }

    private mapToObject = (obj: any[]) =>
        obj.map((item: any) =>
            new ActivityRankingItem(
                obj.indexOf(item) + 1,
                item.name,
                item.type,
                item.time,
                item.averageSpeed,
                item.startDate));

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