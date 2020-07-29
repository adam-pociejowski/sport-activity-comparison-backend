import {UpdateRaceRequest} from "../model/request/update.race.request.model";
import {MongoModelService} from "../../mongo/service/mongo.model.service";
import {Schema} from "mongoose";
import {RaceConfigurationService} from "./race.configuration.service";
import {RaceConfiguration} from "../model/config/race.configuration.model";
import {RaceEvent} from "../model/event/race.event.model";
import {PlayerEvent} from "../model/event/player.event.model";
import {LocationData} from "../../activity/model/location.model";
import {NpcRiderEvent} from "../model/event/npc.rider.event.model";
import {SimulateRaceService} from "./simulate.race.service";

export class UpdateRaceService extends MongoModelService<RaceEvent> {
    public static INSTANCE = new UpdateRaceService();
    private simulateRaceService = new SimulateRaceService();

    private constructor() {
        super('race-events', UpdateRaceService.getSchema());
    }

    updateRaceState = async (request: UpdateRaceRequest) => {
        let raceConfig: RaceConfiguration = await this.findRaceConfig(request.raceId);
        let previousRaceEvents: RaceEvent[] = await this.MongoModel
            .find({"raceId": request.raceId})
            .sort({"distance": 1})
            .limit(2)
            .then((data: any[]) => data.map((item: any) => this.mapToObject(item)));
        console.log(previousRaceEvents);
        this.simulateRaceService.simulate(raceConfig, previousRaceEvents, request);
    }

    mapToObject = (data: any) =>
        new RaceEvent(
            data.raceId,
            data.stageId,
            new Date(data.date),
            data.distance,
            new PlayerEvent(
                new LocationData(
                    data.playerEvent.location.lat,
                    data.playerEvent.location.lng,
                    data.playerEvent.location.alt
                ),
                data.playerEvent.velocity,
                data.playerEvent.position,
                data.playerEvent.time
            ),
            data.npcEvents
                .map((event: any) =>
                    new NpcRiderEvent(
                        event.riderId,
                        event.position,
                        event.time,
                        event.velocity,
                        event.currentCondition,
                    )));

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
                    lat: Number,
                    lng: Number,
                    alt: Number
                },
                velocity: Number,
                position: Number,
                time: Number
            },
            npcEvents: [
                {
                    riderId: String,
                    position: Number,
                    time: Number,
                    velocity: Number,
                    currentCondition: Number
                }
            ]
        });
    }
}