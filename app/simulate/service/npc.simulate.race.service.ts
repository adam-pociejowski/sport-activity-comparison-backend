import { RaceEvent } from "../model/race.event.model";
import { RaceConfiguration } from "../../core/model/race.configuration.model";
import { UpdateRaceRequest } from "../model/update.race.request.model";
import { PlayerEvent } from "../model/player.event.model";
import { Stage } from "../../core/model/stage.model";
import { SimulateRaceService } from "./simulate.race.service";
import { RaceRider } from "../../core/model/race.rider.model";
import { RaceEventService } from "../../core/service/race.event.service";
import { RaceUtils } from "../util/race.utils";
import { NpcRiderEvent } from "../model/npc.rider.event.model";

export class NPCSimulateRaceService implements SimulateRaceService {
    public static INSTANCE = new NPCSimulateRaceService();
    private constructor() {}

    public simulate = async (config: RaceConfiguration,
                             stage: Stage,
                             request: UpdateRaceRequest) => {
        return new RaceEvent(
            config.raceId,
            stage.stageId,
            new Date(),
            request.distance,
            new PlayerEvent(request.location, 10.0, request.time),
            (await this.simulateNpcEvents(
                config,
                request.distance,
                stage)));
    }

    private simulateNpcEvents = async (config: RaceConfiguration, currentDistance: number, stage: Stage) => {
        let lastEvent = await RaceUtils.getLastEvent(config.raceId, stage.stageId);
        return config
            .riders
            .map((raceRider: RaceRider) => this.generateNextNpcRiderEvent(
                lastEvent,
                raceRider,
                config,
                currentDistance,
                stage));
    }

    private generateNextNpcRiderEvent = (lastEvent: RaceEvent | null,
                                         raceRider: RaceRider,
                                         raceConfig: RaceConfiguration,
                                         currentDistance: number,
                                         stage: Stage) => {
        let riderEvent = lastEvent !== null ?
            this.findNpcRiderEvent(lastEvent!, raceRider)! :
            null;
        let previousTime = riderEvent !== null ? riderEvent.time : 0.0;
        let previousDistance = lastEvent !== null ? lastEvent!.distance : 0.0;
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
