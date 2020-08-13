import { LocationData } from "./location.model";

export class ActivityTrackPoint {
    constructor(public location: LocationData,
                public time: number,
                public distance: number,
                public velocity: number) {}
}