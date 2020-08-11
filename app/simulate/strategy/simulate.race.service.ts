import { RaceMode } from "../model/config/race.mode";
import { RaceConfiguration } from "../model/config/race.configuration.model";
import { UpdateRaceRequest } from "../model/request/update.race.request.model";
import { RaceEvent } from "../model/event/race.event.model";

export interface SimulateRaceService {
    getRaceMode(): RaceMode;
    simulate(raceConfig: RaceConfiguration, request: UpdateRaceRequest): RaceEvent;
}