import { MongoModelService } from "../../mongo/service/mongo.model.service";
import { Schema } from "mongoose";
import { Rider } from "../model/config/rider.model";
import { RiderAbilities } from "../model/config/rider.abilities.model";

export class RidersService extends MongoModelService<Rider> {
    public static INSTANCE = new RidersService();
    private constructor() {
        super('riders', RidersService.getSchema());
    }

    public findByLimit = (limit: number) =>
        this.MongoModel
            .find({})
            .limit(limit)
            .then((data: any[]) => data.map((item: any) => this.mapToObject(item)));

    mapToObject(data: any): Rider {
        return new Rider(
            data.riderId,
            data.firstName,
            data.lastName,
            data.country,
            new RiderAbilities(
                data.abilities.flat,
                data.abilities.mountain,
                data.abilities.hill,
                data.abilities.timeTrial));
    }

    private static getSchema() {
        return new Schema({
            riderId: String,
            firstName: String,
            lastName: String,
            country: String,
            abilities: {
                flat: Number,
                mountain: Number,
                hill: Number,
                timeTrial: Number
            }
        })
    }
}