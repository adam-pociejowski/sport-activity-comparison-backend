import * as express from "express";
import { RaceConfigurationService } from "../service/race.configuration.service";
import { UpdateRaceService } from "../service/update.race.service";
import { Request, Response } from "express";
import {RaceEvent} from "../model/event/race.event.model";

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
            .then((raceEvent: RaceEvent) => response.send(raceEvent))
            .catch((error: any) => response.send(error));
    }
}