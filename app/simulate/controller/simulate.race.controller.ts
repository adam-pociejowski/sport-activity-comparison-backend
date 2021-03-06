import * as express from "express";
import { RaceConfigurationService } from "../service/race.configuration.service";
import { UpdateRaceService } from "../service/update.race.service";
import { Request, Response } from "express";
import { ActivityRanking } from "../../activity/model/activity.ranking.model";
import { RankingItemRaceEvent } from "../model/ranking/ranking.item.race.event";

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
        RaceConfigurationService
            .INSTANCE
            .initRace(request.body)
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