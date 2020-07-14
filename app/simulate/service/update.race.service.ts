import { SimulateRaceService } from "./simulate.race.service";
import { UpdateRaceRequest } from "../model/update.race.request.model";

export class UpdateRaceService extends SimulateRaceService<UpdateRaceRequest, any> {
    constructor() {
        super();
    }

    execute = (param: UpdateRaceRequest) =>
        new Promise((resolve) => {
            resolve();
        });
}