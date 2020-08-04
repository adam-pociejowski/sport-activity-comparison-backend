import { UpdateRaceRequest } from "../model/request/update.race.request.model";
import { MongoModelService } from "../../mongo/service/mongo.model.service";
import { Schema } from "mongoose";
import { RaceConfigurationService } from "./race.configuration.service";
import { RaceConfiguration } from "../model/config/race.configuration.model";
import { RaceEvent } from "../model/event/race.event.model";
import { PlayerEvent } from "../model/event/player.event.model";
import { LocationData } from "../../activity/model/location.model";
import { NpcRiderEvent } from "../model/event/npc.rider.event.model";
import { SimulateRaceEventService } from "./simulate.race.event.service";
import { RaceRider } from "../model/config/race.rider.model";
import { ActivityRankingConverter } from "../../activity/converter/activity.ranking.converter";

export class UpdateRaceService extends MongoModelService<RaceEvent> {
    public static INSTANCE = new UpdateRaceService();
    private simulateRaceService = new SimulateRaceEventService();

    private constructor() {
        super('race-events', UpdateRaceService.getSchema());
    }

    updateRaceState = async (request: UpdateRaceRequest) => {
        console.log(request);
        let raceConfig: RaceConfiguration = await this.findRaceConfig(request.raceId);
        let previousRaceEvents: RaceEvent[] = await this.findPreviousEvents(2, request.raceId);
        let raceEvent = this.simulateRaceService.simulate(raceConfig, request.stageId, previousRaceEvents, request);
        this.save(raceEvent);
        return ActivityRankingConverter.fromRaceEvent(this.prepareRaceRidersMap(raceConfig.riders), raceEvent);
    };

    mapToObject = (data: any) =>
        new RaceEvent(
            data.raceId,
            data.stageId,
            new Date(data.date),
            data.distance,
            new PlayerEvent(
                new LocationData(
                    data.playerEvent.location.latitude,
                    data.playerEvent.location.longitude,
                    data.playerEvent.location.accuracy,
                    data.playerEvent.location.altitude
                ),
                data.playerEvent.velocity,
                data.playerEvent.time
            ),
            data.npcEvents
                .map((event: any) =>
                    new NpcRiderEvent(
                        event.riderId,
                        event.time,
                        event.velocity,
                        event.currentCondition,
                    )));

    public prepareRaceRidersMap = (raceRiders: RaceRider[]) => {
        let raceRidersMap = new Map<string, RaceRider>();
        raceRiders
            .forEach((raceRider: RaceRider) => raceRidersMap.set(raceRider.rider.riderId, raceRider));
        return raceRidersMap;
    }

    private findPreviousEvents = (limit: number,
                                  raceId: string) =>
        this.MongoModel
            .find({"raceId": raceId})
            .sort({"distance": 1})
            .limit(limit)
            .then((data: any[]) => data.map((item: any) => this.mapToObject(item)));

    private findRaceConfig = (raceId: string) =>
        RaceConfigurationService
            .INSTANCE
            .findByFilter({"raceId": raceId})
            .then((configs: RaceConfiguration[]) => configs[0]);

    private static getSchema() {
        return new Schema({
            raceId: String,
            stageId: String,
            date: Date,
            distance: Number,
            playerEvent: {
                location: {
                    latitude: Number,
                    longitude: Number,
                    accuracy: Number,
                    altitude: Number
                },
                velocity: Number,
                time: Number
            },
            npcEvents: [
                {
                    riderId: String,
                    time: Number,
                    velocity: Number,
                    currentCondition: Number
                }
            ]
        });
    }
}
