import {Collection, MongoClient} from 'mongodb';

export abstract class MongoService<T> {
    protected mongoClient: MongoClient;
    protected collection!: Collection;

    protected constructor(protected collectionName: string,
                          protected databaseName: string) {
        this.mongoClient = this.getMongoClient();
        this.mongoClient.connect(() =>
            this.collection = this.mongoClient
                .db(this.databaseName)
                .collection(this.collectionName));
    }

    protected abstract mapToObject(obj: any): T;

    private getMongoClient = () => new MongoClient(process.env.MONGODB_CONNECTION_URL!!);
}