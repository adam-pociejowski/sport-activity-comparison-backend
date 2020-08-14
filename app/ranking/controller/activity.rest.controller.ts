import { Request, Response } from "express";
import * as express from 'express';
import { UserRankingRequest } from "../../history/model/user.ranking.request.model";
import { ActivityRankingItem } from "../model/activity.ranking.item.model";
import { ActivityRanking } from "../model/activity.ranking.model";
import { ActivityType } from "../../core/enums/activity.type.enum";
import { ActivityRankingItemInfo } from "../model/activity.ranking.item.info.model";
import { SimpleUserHistoryService } from "../../history/service/simple.user.history.service";

export class ActivityRestController {
    public router = express.Router();
    constructor() {
        this.initRoutes();
    }

    private initRoutes = () => {
        this.router.get('/ranking/:activityType/:distance', this.getResultRanking);
    };

    private getResultRanking = (request: Request, response: Response) => {
        try {
            let req = new UserRankingRequest(
                request.params.activityType as ActivityType,
                +request.params.distance,
                0.0);
            SimpleUserHistoryService
                .INSTANCE
                .find(req)
                .then((ranking: ActivityRankingItem<ActivityRankingItemInfo>[] | void) => new ActivityRanking(ranking, req.distance))
                .then((ranking: ActivityRanking<ActivityRankingItemInfo> | void) => response.send(ranking))
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
