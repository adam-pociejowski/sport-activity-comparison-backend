import { RaceEvent } from "../model/event/race.event.model";
import { RaceConfiguration } from "../model/config/race.configuration.model";
import { RaceRider } from "../model/config/race.rider.model";
import { NpcRiderEvent } from "../model/event/npc.rider.event.model";
import { UpdateRaceRequest } from "../model/request/update.race.request.model";
import { RaceUtils } from "../util/race.utils";
import { PlayerEvent } from "../model/event/player.event.model";

export class SimulateRaceEventService {

    public simulate = (raceConfig: RaceConfiguration,
                       stageId: string,
                       events: RaceEvent[],
                       request: UpdateRaceRequest) =>
        new RaceEvent(
            raceConfig.raceId,
            stageId,
            new Date(),
            request.distance,
            new PlayerEvent(
                request.location,
                10.0,
                request.time
            ),
            this.simulateNpcEvents(raceConfig, this.getLastEvent(events), request.distance)
        );

    private simulateNpcEvents = (raceConfig: RaceConfiguration,
                                 lastEvent: RaceEvent | null,
                                 currentDistance: number) =>
        raceConfig
            .riders
            .map((raceRider: RaceRider) => this.generateNextEventData(lastEvent, raceRider, raceConfig, currentDistance));

    private generateNextEventData = (lastEvent: RaceEvent | null,
                                     raceRider: RaceRider,
                                     raceConfig: RaceConfiguration,
                                     currentDistance: number) => {
        let riderEvent = lastEvent !== null ?
            this.findNpcRiderEvent(lastEvent, raceRider)! :
            null;
        let previousTime = riderEvent !== null ? riderEvent.time : 0.0;
        let previousDistance = lastEvent !== null ? lastEvent.distance : 0.0;
        let velocity = RaceUtils.calculateBaseVelocity(raceConfig, raceRider, riderEvent);
        return new NpcRiderEvent(
            raceRider.rider.riderId,
            previousTime + RaceUtils.calculateTimeInSeconds(currentDistance - previousDistance, velocity),
            velocity,
            RaceUtils.calculateRiderCondition(riderEvent !== null ? riderEvent.currentCondition : 1.0, raceConfig.maxRiderCurrentConditionChangePerEvent));
    }

    private findNpcRiderEvent = (event: RaceEvent,
                                 rider: RaceRider) =>
        event
            .npcEvents
            .find((npcRider: NpcRiderEvent) => npcRider.riderId === rider.rider.riderId);

    private getLastEvent = (events: RaceEvent[]) =>
        events.length == 0 ?
            null :
            events[events.length - 1];
}
