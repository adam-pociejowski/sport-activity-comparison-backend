import { RaceEvent } from "../model/event/race.event.model";
import { RaceConfiguration } from "../model/config/race.configuration.model";
import { RaceRider } from "../model/config/race.rider.model";
import { NpcRiderEvent } from "../model/event/npc.rider.event.model";
import { UpdateRaceRequest } from "../model/request/update.race.request.model";

export class SimulateRaceService {

    public simulate = (raceConfig: RaceConfiguration,
                       events: RaceEvent[],
                       request: UpdateRaceRequest) => {
        let difficulty = raceConfig.difficulty;
        let lastEvent: RaceEvent | null = this.getLastEvent(events);
        raceConfig.riders
            .map((rider: RaceRider) => {
                if (lastEvent !== null) {
                    let riderEvent: NpcRiderEvent = this.findNpcRiderEvent(lastEvent, rider)!;
                    let movedDistance = request.distance - lastEvent.distance;
                }
            });
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