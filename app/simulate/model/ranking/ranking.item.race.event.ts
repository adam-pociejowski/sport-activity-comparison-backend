import { RankingItemRaceEventType } from "./ranking.item.race.event.type";
import { Country } from "../../../core/model/country.enum";

export class RankingItemRaceEvent {
    constructor(public name: string,
                public type: RankingItemRaceEventType,
                public power: number,
                public country: Country) {}
}