import { Schema } from 'mongoose';
import { MongoService } from "./mongo.service";

export abstract class MongoModelService<T> {
    protected MongoModel: any;

    findAll = () => this.MongoModel
        .find({})
        .then((data: any[]) => data.map((item: any) => this.mapToObject(item)));

    findByFilter = (filter: any) => this.MongoModel
        .find(filter)
        .then((data: any[]) => data.map((item: any) => this.mapToObject(item)));

    protected save = (obj: T) =>
        this.MongoModel(obj)
            .save();

    public abstract mapToObject(data: any) : T;

    protected constructor(schemaName: string, schemaDefinition: Schema) {
        MongoService
            .INSTANCE
            .connect()
            .then((connection: any) => this.MongoModel = connection.model(schemaName, schemaDefinition, schemaName));
    }
}
