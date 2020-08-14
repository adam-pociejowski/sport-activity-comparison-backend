import { RankingItemRaceEventType } from "../enums/ranking.item.race.event.type";
import { Country } from "../../core/enums/country.enum";

export class RankingItemRaceEvent {
    constructor(public name: string,
                public type: RankingItemRaceEventType,
                public power: number,
                public country: Country) {}
}