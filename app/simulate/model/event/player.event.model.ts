import { LocationData } from "../../../activity/model/location.model";

export class PlayerEvent {
    constructor(public location: LocationData,
                public velocity: number,
                public position: number,
                public time: number) {}
}