import { RaceConfiguration } from "../model/config/race.configuration.model";
import { RaceEvent } from "../model/event/race.event.model";
import { Stage } from "../model/config/stage.model";
import { RaceRider } from "../model/config/race.rider.model";
import { RaceUtils } from "../util/race.utils";
import { NpcRiderEvent } from "../model/event/npc.rider.event.model";
import { RaceEventService } from "../service/race.event.service";

export abstract class AbstractSimulateRaceService {

    protected simulateNpcEvents = (raceConfig: RaceConfiguration,
                                   currentDistance: number,
                                   stage: Stage) =>
        raceConfig
            .riders
            .map((raceRider: RaceRider) => this.generateNextEventData(
                this.getLastEvent(
                    RaceEventService
                        .INSTANCE
                        .findPreviousEvents(1, raceConfig.raceId)),
                raceRider,
                raceConfig,
                currentDistance,
                stage));

    private getLastEvent = (events: RaceEvent[]) => events.length == 0 ? null : events[events.length - 1];

    private generateNextEventData = (lastEvent: RaceEvent | null,
                                     raceRider: RaceRider,
                                     raceConfig: RaceConfiguration,
                                     currentDistance: number,
                                     stage: Stage) => {
        let riderEvent = lastEvent !== null ?
            this.findNpcRiderEvent(lastEvent, raceRider)! :
            null;
        let previousTime = riderEvent !== null ? riderEvent.time : 0.0;
        let previousDistance = lastEvent !== null ? lastEvent.distance : 0.0;
        let { velocity, power } = RaceUtils.calculateBaseVelocity(raceConfig, raceRider, riderEvent, stage);
        return new NpcRiderEvent(
            raceRider.rider.riderId,
            previousTime + RaceUtils.calculateTimeInSeconds(currentDistance - previousDistance, velocity),
            velocity,
            power,
            RaceUtils.calculateRiderCondition(
                riderEvent !== null ?
                    riderEvent.currentCondition :
                    1.0,
                raceConfig.maxRiderCurrentConditionChangePerEvent,
                raceConfig.riderCurrentConditionVariability));
    }

    private findNpcRiderEvent = (event: RaceEvent, rider: RaceRider) =>
        event
            .npcEvents
            .find((npcRider: NpcRiderEvent) => npcRider.riderId === rider.rider.riderId);
}