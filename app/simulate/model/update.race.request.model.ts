import { LocationData } from "../../core/model/location.model";
import { RankingType } from "../../ranking/enums/ranking.type";

export class UpdateRaceRequest {
    constructor(public raceId: string,
                public stageId: string,
                public location: LocationData,
                public time: number,
                public rankingType: RankingType,
                public distance: number) {}
}
