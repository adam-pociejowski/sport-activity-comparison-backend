import { LocationData } from "../../core/model/location.model";

export class PlayerEvent {
    constructor(public location: LocationData,
                public velocity: number,
                public time: number) {}
}