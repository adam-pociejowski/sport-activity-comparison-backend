import { LocationData } from "../../../ranking/model/activity/location.model";
import { RankingType } from "../../../ranking/model/race/ranking.type";

export class UpdateRaceRequest {
    constructor(public raceId: string,
                public stageId: string,
                public location: LocationData,
                public time: number,
                public rankingType: RankingType,
                public distance: number) {}
}
