import { RaceConfiguration } from "../../core/model/race.configuration.model";
import { UpdateRaceRequest } from "../model/update.race.request.model";
import { RaceEvent } from "../model/race.event.model";
import { Stage } from "../../core/model/stage.model";

export interface SimulateRaceService {
    simulate(raceConfig: RaceConfiguration, stage: Stage, request: UpdateRaceRequest): Promise<RaceEvent>;
}