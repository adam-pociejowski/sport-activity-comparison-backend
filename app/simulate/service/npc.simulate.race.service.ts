import { RaceEvent } from "../model/event/race.event.model";
import { RaceConfiguration } from "../model/config/race.configuration.model";
import { UpdateRaceRequest } from "../model/request/update.race.request.model";
import { PlayerEvent } from "../model/event/player.event.model";
import { Stage } from "../model/config/stage.model";
import { SimulateRaceService } from "./simulate.race.service";
import { RaceRider } from "../model/config/race.rider.model";
import { RaceEventService } from "../../core/service/race.event.service";
import { RaceUtils } from "../util/race.utils";
import { NpcRiderEvent } from "../model/event/npc.rider.event.model";

export class NPCSimulateRaceService implements SimulateRaceService {
    public static INSTANCE = new NPCSimulateRaceService();
    private constructor() {}

    public simulate = (config: RaceConfiguration, request: UpdateRaceRequest) => {
        return new RaceEvent(
            config.raceId,
            request.stageId,
            new Date(),
            request.distance,
            new PlayerEvent(request.location, 10.0, request.time),
            this.simulateNpcEvents(
                config,
                request.distance,
                config
                    .stages
                    .find((stage: Stage) => stage.stageId === request.stageId)!)
        );
    }

    private simulateNpcEvents = (raceConfig: RaceConfiguration, currentDistance: number, stage: Stage) =>
        raceConfig
            .riders
            .map((raceRider: RaceRider) => this.generateNextNpcRiderEvent(
                this.getLastEvent(
                    RaceEventService
                        .INSTANCE
                        .findPreviousEvents(1, raceConfig.raceId)),
                raceRider,
                raceConfig,
                currentDistance,
                stage));

    private getLastEvent = (events: RaceEvent[]) => events.length == 0 ? null : events[events.length - 1];

    private generateNextNpcRiderEvent = (lastEvent: RaceEvent | null,
                                         raceRider: RaceRider,
                                         raceConfig: RaceConfiguration,
                                         currentDistance: number,
                                         stage: Stage) => {
        let riderEvent = lastEvent !== undefined ?
            this.findNpcRiderEvent(lastEvent!, raceRider)! :
            null;
        let previousTime = riderEvent !== null ? riderEvent.time : 0.0;
        let previousDistance = lastEvent !== undefined ? lastEvent!.distance : 0.0;
        let { velocity, power } = RaceUtils.calculateBaseVelocity(raceConfig, raceRider, riderEvent, stage);
        return new NpcRiderEvent(
            raceRider.rider.riderId,
            previousTime + RaceUtils.calculateTimeInSeconds(currentDistance - previousDistance, velocity),
            velocity,
            power,
            RaceUtils.calculateRiderCondition(
                riderEvent !== null ?
                    riderEvent.currentCondition :
                    RaceUtils.randomDouble(1.0 - raceConfig.riderCurrentConditionVariability, 1.0) * raceRider.raceCondition,
                raceConfig.maxRiderCurrentConditionChangePerEvent,
                raceConfig.riderCurrentConditionVariability));
    }

    private findNpcRiderEvent = (event: RaceEvent, rider: RaceRider) =>
        event
            .npcEvents
            .find((npcRider: NpcRiderEvent) => npcRider.riderId === rider.rider.riderId);
}
