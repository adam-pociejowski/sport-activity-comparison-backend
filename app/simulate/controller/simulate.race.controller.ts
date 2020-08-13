import * as express from "express";
import { UpdateRaceService } from "../service/update.race.service";
import { Request, Response } from "express";
import { ActivityRanking } from "../../ranking/model/activity/activity.ranking.model";
import { RankingItemRaceEvent } from "../../ranking/model/race/ranking.item.race.event";
import { RaceInitService } from "../service/race.init.service";

export class SimulateRaceController {
    public router = express.Router();

    constructor() {
        this.initRoutes();
    }

    private initRoutes = () => {
        this.router.post('/init', this.initRace);
        this.router.post('/update', this.updateRace);
    };

    private initRace = (request: Request, response: Response) =>
        RaceInitService
            .INSTANCE
            .init(request.body)
            .then((doc: any) => response.send(doc))
            .catch((error: any) => response.send(error));

    private updateRace = (request: Request, response: Response) => {
        UpdateRaceService
            .INSTANCE
            .updateRaceState(request.body)
            .then((ranking: ActivityRanking<RankingItemRaceEvent>) => response.send(ranking))
            .catch((error: any) => response.send(error));
    }
}