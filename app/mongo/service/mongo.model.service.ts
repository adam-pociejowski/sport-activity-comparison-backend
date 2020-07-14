import { Schema } from 'mongoose';
import { MongoService } from "./mongo.service";

export abstract class MongoModelService {
    protected MongoModel: any;

    protected constructor(schemaName: string, schemaDefinition: Schema) {
        MongoService
            .instance
            .connect()
            .then((connection: any) => this.MongoModel = connection.model(schemaName, schemaDefinition, schemaName));
    }
}
