import { LocationData } from "../../../ranking/model/activity/location.model";

export class PlayerEvent {
    constructor(public location: LocationData,
                public velocity: number,
                public time: number) {}
}