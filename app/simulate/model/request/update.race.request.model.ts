import { LocationData } from "../../../activity/model/location.model";

export class UpdateRaceRequest {
    constructor(public raceId: string,
                public location: LocationData,
                public time: number,
                public distance: number) {}
}