import { RaceEvent } from "../../simulate/model/race.event.model";
import { RankingItemRaceEvent } from "../model/ranking.item.race.event";
import { ActivityRanking } from "../model/activity.ranking.model";
import { RaceRankingService } from "./race.ranking.service";
import { RaceConfiguration } from "../../core/model/race.configuration.model";
import { AbstractRaceRankingService } from "./abstract.race.ranking.service";
import { RaceRankingItem } from "../model/race.ranking.item.model";
import { RankingType } from "../enums/ranking.type";
import { RaceStatus } from "../../core/enums/race.status";
import { RaceEventService } from "../../core/service/race.event.service";
import { PlayerEvent } from "../../simulate/model/player.event.model";
import { NpcRiderEvent } from "../../simulate/model/npc.rider.event.model";

export class NPCPlayerRaceGeneralRankingService extends AbstractRaceRankingService implements RaceRankingService {
    public static INSTANCE = new NPCPlayerRaceGeneralRankingService();
    private constructor() {
        super();
    }

    public generate = async (raceEvent: RaceEvent, status: RaceStatus, config: RaceConfiguration) => {
        let generalRaceEvent = await this.prepareRaceEvent(raceEvent, config);
        return Promise
            .resolve(
                new ActivityRanking<RankingItemRaceEvent>(
                    new Array<RaceRankingItem>()
                        .concat(this.pushPlayerItem(generalRaceEvent.playerEvent.time))
                        .concat(this.pushNpcRankingItems(this.prepareRaceRidersMap(config.riders), generalRaceEvent.npcEvents))
                        .map((rankingItem: RaceRankingItem) => this.mapToActivityRankingItem(rankingItem)),
                    status,
                    generalRaceEvent.distance));
    }

    private prepareRaceEvent = async (raceEvent: RaceEvent, config: RaceConfiguration) => {
        let ranking = (await RaceEventService
            .INSTANCE
            .getMongoModel()
            .aggregate(this.getAggregateRaceTimesFromAllStages(config.raceId)))[0];
        return new RaceEvent(
            config.raceId,
            raceEvent.stageId,
            raceEvent.date,
            ranking.distance,
            new PlayerEvent(
                raceEvent.playerEvent.location,
                raceEvent.playerEvent.velocity,
                ranking.playerTime
            ),
            ranking.npcRiders
                .map((rider: any) =>
                    new NpcRiderEvent(
                        rider._id,
                        rider.time,
                        25.5,
                        0.8,
                        0.8
                    )));
    }

    private getAggregateRaceTimesFromAllStages = (raceId: string) =>
        [
            {
                '$match': {
                    'raceId': raceId
                }
            }, {
            '$group': {
                '_id': '$stageId',
                'distance': {
                    '$max': '$distance'
                },
                'npcEvents': {
                    '$last': '$npcEvents'
                },
                'playerEvent': {
                    '$last': '$playerEvent'
                }
            }
        }, {
            '$facet': {
                'distance': [
                    {
                        '$group': {
                            '_id': null,
                            'distance': {
                                '$sum': '$distance'
                            }
                        }
                    }
                ],
                'player': [
                    {
                        '$group': {
                            '_id': null,
                            'time': {
                                '$sum': '$playerEvent.time'
                            }
                        }
                    }
                ],
                'npcRiders': [
                    {
                        '$unwind': '$npcEvents'
                    }, {
                        '$group': {
                            '_id': '$npcEvents.riderId',
                            'time': {
                                '$sum': '$npcEvents.time'
                            }
                        }
                    }
                ]
            }
        }, {
            '$project': {
                'distance': {
                    '$arrayElemAt': [
                        '$distance.distance', 0
                    ]
                },
                'playerTime': {
                    '$arrayElemAt': [
                        '$player.time', 0
                    ]
                },
                'npcRiders': 1
            }
        }];

    getRankingType = () => RankingType.PLAYER_NPC_GENERAL;
}
