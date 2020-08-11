import { PlayerEvent } from "./player.event.model";
import { NpcRiderEvent } from "./npc.rider.event.model";

export class RaceEvent {
    constructor(public raceId: string,
                public stageId: string,
                public date: Date,
                public distance: number,
                public playerEvent: PlayerEvent,
                public npcEvents: NpcRiderEvent[]) {}
}