import { MongoClient } from 'mongodb';

export abstract class MongoService<T> {
    protected constructor(private collectionName: string,
                          private databaseName: string) {}

    private getMongoClient = () => new MongoClient(process.env.MONGODB_CONNECTION_URL!!);
}