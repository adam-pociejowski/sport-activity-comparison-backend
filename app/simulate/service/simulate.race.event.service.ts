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
                1,
                request.time
            ),
            this.simulateNpcEvents(raceConfig, this.getLastEvent(events), request.distance)
        );

    private simulateNpcEvents = (raceConfig: RaceConfiguration,
                                 lastEvent: RaceEvent | null,
                                 currentDistance: number) =>
        raceConfig
            .riders
            .map((raceRider: RaceRider) => {
                if (lastEvent !== null) {
                    let riderEvent: NpcRiderEvent = this.findNpcRiderEvent(lastEvent, raceRider)!;
                    let velocity = RaceUtils.calculateBaseVelocity(raceConfig.difficulty, raceRider);
                    return {
                        riderId: raceRider.rider.riderId,
                        riderName: `${raceRider.rider.firstName} ${raceRider.rider.lastName}`,
                        time: riderEvent.time + RaceUtils.calculateTimeInSeconds(currentDistance - lastEvent.distance, velocity),
                        velocity: velocity,
                        currentCondition: riderEvent.currentCondition,
                    }
                }
            })
            .sort((a: any, b: any) => a.time - b.time)
            .map((obj: any, index: number) =>
                new NpcRiderEvent(
                    obj.riderId,
                    obj.riderName,
                    index + 1,
                    obj.time,
                    obj.velocity,
                    obj.currentCondition));

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
