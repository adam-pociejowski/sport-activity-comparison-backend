import { ActivityType } from "../enums/activity.type.enum";
import { RiderAbilities } from "./rider.abilities.model";
import { RaceStatus } from "../enums/race.status";

export class Stage {
    constructor(public stageId: string,
                public distance: number,
                public abilitiesFactor: RiderAbilities,
                public activityType: ActivityType,
                public status: RaceStatus) {}
}