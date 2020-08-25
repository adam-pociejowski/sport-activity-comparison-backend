import { MongoModelService } from "./mongo.model.service";
import { RaceEvent } from "../../simulate/model/race.event.model";
import { PlayerEvent } from "../../simulate/model/player.event.model";
import { LocationData } from "../model/location.model";
import { NpcRiderEvent } from "../../simulate/model/npc.rider.event.model";
import { Schema } from "mongoose";

export class RaceEventService extends MongoModelService<RaceEvent>  {
    public static INSTANCE = new RaceEventService();

    private constructor() {
        super('race-events', RaceEventService.getSchema());
    }

    public findPreviousEvents = (limit: number, raceId: string, stageId: string) =>
        this.MongoModel
            .find({"raceId": raceId, "stageId": stageId})
            .sort({"distance": -1})
            .limit(limit)
            .then((data: any[]) => data.map((item: any) => this.mapToObject(item)));

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
                        event.power,
                        event.currentCondition,
                    )));


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
                    power: Number,
                    currentCondition: Number
                }
            ]
        });
    }
}