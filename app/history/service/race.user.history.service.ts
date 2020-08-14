import { AbstractUserHistoryService } from "./abstract.user.history.service";
import { RankingItemRaceEventType } from "../../ranking/enums/ranking.item.race.event.type";
import { RankingItemRaceEvent } from "../../ranking/model/ranking.item.race.event";
import { Country } from "../../core/enums/country.enum";

export class RaceUserHistoryService extends AbstractUserHistoryService<RankingItemRaceEvent>  {
    public static INSTANCE = new RaceUserHistoryService();
    protected constructor() {
        super();
    }

    protected mapToInfo = (obj: any) =>
        new RankingItemRaceEvent(
            new Date(obj.startDate).toISOString().substring(0, 10),
            RankingItemRaceEventType.USER_OLD_ACTIVITY,
            0.9,
            Country.POL);
}