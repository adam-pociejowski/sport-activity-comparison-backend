import * as express from "express";
import { InitRaceService } from "../service/init.race.service";
import { UpdateRaceService } from "../service/update.race.service";
import { Request, Response } from "express";

export class SimulateRaceController {
    public router = express.Router();
    private initRaceService = new InitRaceService();
    private updateRaceService = new UpdateRaceService();


    constructor() {
        this.initRoutes();
    }

    private initRoutes = () => {
        this.router.post('/init', this.initRace);
        this.router.post('/update', this.updateRace);
    };

    private initRace = (request: Request, response: Response) => {
        this.initRaceService
            .execute(request.body)
            .then(() => response.send('OK'));
    }

    private updateRace = (request: Request, response: Response) => {
        this.updateRaceService
            .execute(request.body)
            .then(() => response.send('OK'));
    }
}