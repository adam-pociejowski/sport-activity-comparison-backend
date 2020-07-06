import { MongoService } from "../../mongo/service/mongo.service";

export abstract class ActivityService<T> extends MongoService<T>{
    protected constructor() {
        super('activity', 'sport-activity');
    }
}