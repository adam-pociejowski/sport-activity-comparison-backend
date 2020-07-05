import { ActivityService } from "../service/activity.service";
import { Request, Response } from "express";
import { ActivityRankingRequest } from "../model/activity.ranking.request.model";

export class ActivityRestController {
    public router = express.Router();
    private activityService = new ActivityService();

    constructor() {
        this.initRoutes();
    }

    private initRoutes = () => {
        this.router.get('/ranking/:activityType/:timeInSec', this.getResultRanking);
    };

    private getResultRanking = (request: Request, response: Response) => {
        try {
            this.activityService.getResultRanking(
                new ActivityRankingRequest(request.params.activityType, +request.params.timeInSec));
            response.send('OK');
        } catch (e) {
            console.log('Exception while comparing activityResults', e);
            response.send(e);
        }
    };
}
