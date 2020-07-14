import { SimulateRaceService } from "./simulate.race.service";
import { InitRaceRequest } from "../model/init.race.request.model";

export class InitRaceService extends SimulateRaceService<InitRaceRequest, any> {
    constructor() {
        super();
    }

    execute = (param: InitRaceRequest) =>
        new Promise((resolve) => {
            resolve();
        });
}