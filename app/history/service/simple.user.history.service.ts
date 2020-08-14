import { ActivityRankingItemInfo } from "../../ranking/model/activity.ranking.item.info.model";
import { AbstractUserHistoryService } from "./abstract.user.history.service";

export class SimpleUserHistoryService extends AbstractUserHistoryService<ActivityRankingItemInfo>  {
    public static INSTANCE = new SimpleUserHistoryService();
    protected constructor() {
        super();
    }

    protected mapToInfo = (obj: any) =>
        new ActivityRankingItemInfo(
            obj.name,
            obj.startDate);
}