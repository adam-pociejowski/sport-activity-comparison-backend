import { RaceRankingService } from "./race.ranking.service";
import { RankingType } from "../enums/ranking.type";
import { NPCPlayerRaceRankingService } from "./npc.player.race.ranking.service";
import { NPCPlayerHistoryRaceRankingService } from "./npc.player.history.race.ranking.service";
import { NPCPlayerRaceGeneralRankingService } from "./npc.player.race.general.ranking.service";

export class RaceRankingServiceFactory {
    private static map = new Map<RankingType, RaceRankingService>([
        [ NPCPlayerRaceRankingService.INSTANCE.getRankingType(), NPCPlayerRaceRankingService.INSTANCE ],
        [ NPCPlayerHistoryRaceRankingService.INSTANCE.getRankingType(), NPCPlayerHistoryRaceRankingService.INSTANCE ],
        [ NPCPlayerRaceGeneralRankingService.INSTANCE.getRankingType(), NPCPlayerRaceGeneralRankingService.INSTANCE ]
    ]);

    public static fromRankingType = (rankingType: RankingType) => {
        let instance = RaceRankingServiceFactory.map.get(rankingType);
        if (instance === undefined) {
            throw new Error(`RaceRankingService instance not found for rankingType: ${rankingType}`);
        }
        return instance;
    }
}
