import { LocationData } from "../../activity/model/location.model";

export class UpdateRaceRequest {
    constructor(public raceId: number,
                public location: LocationData,
                public time: number) {}
}