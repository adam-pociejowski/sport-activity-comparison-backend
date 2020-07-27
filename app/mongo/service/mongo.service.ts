import mongoose from 'mongoose';

export class MongoService {
    public static INSTANCE: MongoService = new MongoService();
    private connection: any = null;

    private constructor() {}

    public connect = () => {
        if (this.connection === null) {
            return mongoose
                .connect(process.env.MONGODB_CONNECTION_URL!!, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                }).then((connection: any) => {
                    this.connection = connection;
                    console.log('Mongo connection success');
                    return connection;
                }).catch((err: any) => console.log('Exception while connection to db', err));
        }
        console.log('Returned cached mongo connection');
        return new Promise(this.connection);
    }
}