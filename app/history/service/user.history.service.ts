import { UserRankingRequest } from "../model/user.ranking.request.model";
import { ActivityRankingItem } from "../../ranking/model/activity.ranking.item.model";

export interface UserHistoryService<T> {
    find(req: UserRankingRequest): Promise<ActivityRankingItem<T>[]>;
}