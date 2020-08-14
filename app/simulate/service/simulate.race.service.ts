import { RaceConfiguration } from "../../core/model/race.configuration.model";
import { UpdateRaceRequest } from "../model/update.race.request.model";
import { RaceEvent } from "../model/race.event.model";

export interface SimulateRaceService {
    simulate(raceConfig: RaceConfiguration, request: UpdateRaceRequest): RaceEvent;
}