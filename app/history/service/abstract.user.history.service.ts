import { ActivityType } from "../../core/enums/activity.type.enum";
import { UserRankingRequest } from "../model/user.ranking.request.model";
import { ActivityRankingItem } from "../../ranking/model/activity.ranking.item.model";
import { UserHistoryService } from "./user.history.service";
import { ActivityService } from "../../ranking/service/activity.service";

export abstract class AbstractUserHistoryService<T> implements UserHistoryService<T> {

    protected abstract mapToInfo(obj: any): T;

    // public find = (req: UserRankingRequest) =>
    //     ActivityService
    //         .INSTANCE
    //         .getMongoModel()
    //         .aggregate(this.preparePipeline(req))
    //         .then((data: any[]) => data.map((item: any) => this.mapToObject(item)));

    public find = async (req: UserRankingRequest) => {
        let res = await ActivityService
            .INSTANCE
            .getMongoModel()
            .aggregate(this.preparePipeline(req));
        return res
            .map((item: any) => this.mapToObject(item));


        // let res = ActivityService
        //     .INSTANCE
        //     .getMongoModel()
        //     .aggregate(this.preparePipeline(req))
        //     .then((data: any[]) => data.map((item: any) => this.mapToObject(item)));
    }


    private mapToObject = (item: any) =>
        new ActivityRankingItem<T>(
            this.mapToInfo(item),
            this.toActivityType(item.type),
            item.time
        );

    private toActivityType = (stravaType: string) => {
        switch (stravaType) {
            case 'Ride':
                return ActivityType.OUTDOOR_RIDE;
            case 'VirtualRide':
                return ActivityType.VIRTUAL_RIDE;
            case 'Run':
                return ActivityType.RUN;
            default:
                return ActivityType.RIDE;
        }
    }

    private preparePipeline = (req: UserRankingRequest) =>
        [
            {
                '$match': this.getMongoMatchQueryBasedOnActivityType(req.activityType)
            }, {
                '$match': {
                    'distance': {
                        '$gt': req.fullActivityDistance
                    },
                }
            }, {
                '$addFields': {
                    'track': {
                        '$filter': {
                            'input': '$track',
                            'as': 'track',
                            'cond': {
                                '$lte': [
                                    '$$track.distance', req.distance
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
                    '$gt': req.distance - 100
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
                                req.distance, '$result.distance'
                            ]
                        }, '$result.time'
                    ]
                },
                'name': 1,
                'averageSpeed': 1,
                'startDate': 1,
                "type": 1
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