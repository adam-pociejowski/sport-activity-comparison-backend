import { ActivityType } from "../../../activity/model/activity.type.enum";
import { RiderAbilities } from "./rider.abilities.model";

export class Stage {
    constructor(public stageId: string,
                public distance: number,
                public abilitiesFactor: RiderAbilities,
                public activityType: ActivityType) {}
}