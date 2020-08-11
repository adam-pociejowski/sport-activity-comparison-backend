import { RaceEvent } from "../model/event/race.event.model";
import { RaceConfiguration } from "../model/config/race.configuration.model";
import { UpdateRaceRequest } from "../model/request/update.race.request.model";
import { PlayerEvent } from "../model/event/player.event.model";
import { Stage } from "../model/config/stage.model";
import { SimulateRaceService } from "./simulate.race.service";
import { RaceMode } from "../model/config/race.mode";
import { AbstractSimulateRaceService } from "./abstract.simulate.race.service";

export class SimulateRacePlayerWithNpcService extends AbstractSimulateRaceService implements SimulateRaceService {
    public static INSTANCE = new SimulateRacePlayerWithNpcService();

    private constructor() {
        super();
    }

    public simulate = (raceConfig: RaceConfiguration,
                       request: UpdateRaceRequest) => {
        return new RaceEvent(
            raceConfig.raceId,
            request.stageId,
            new Date(),
            request.distance,
            new PlayerEvent(request.location, 10.0, request.time),
            this.simulateNpcEvents(
                raceConfig,
                request.distance,
                raceConfig
                    .stages
                    .find((stage: Stage) => stage.stageId === request.stageId)!)
        );
    }

    public getRaceMode = (): RaceMode => RaceMode.PLAYER_WITH_NPC;
}
