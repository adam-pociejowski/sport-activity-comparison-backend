import { ActivityType } from "../../../activity/model/activity.type.enum";

export class Stage {
    constructor(public stageId: string,
                public distance: number,
                public activityType: ActivityType) {}
}