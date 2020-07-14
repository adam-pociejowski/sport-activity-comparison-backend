import { Request, Response } from "express";
import * as express from 'express';
import { ActivityRankingRequest } from "../model/activity.ranking.request.model";
import { ActivityRankingService } from "../service/activity.ranking.service";
import { ActivityRankingItem } from "../model/activity.ranking.item.model";
import { ActivityRanking } from "../model/activity.ranking.model";
import { ActivityType } from "../model/activity.type.enum";

export class ActivityRestController {
    public router = express.Router();
    private activityRankingService = new ActivityRankingService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes = () => {
        this.router.get('/ranking/:activityType/:distance', this.getResultRanking);
    };

    private getResultRanking = (request: Request, response: Response) => {
        try {
            let activityRequest = new ActivityRankingRequest(request.params.activityType as ActivityType, +request.params.distance);
            this.activityRankingService
                .getResultRanking(activityRequest)
                .then((ranking: ActivityRankingItem[] | void) => new ActivityRanking(ranking, activityRequest.distance, activityRequest.activityType))
                .then((ranking: ActivityRanking | void) => response.send(ranking))
                .catch((e: any) => {
                    console.log('Exception while aggregating data', e);
                    response.send(e);
                });
        } catch (e) {
            console.log('Exception while comparing activityResults', e);
            response.send(e);
        }
    };
}
