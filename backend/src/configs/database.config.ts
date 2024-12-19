import { connect, ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const dbConnect = () => {
    if (!process.env.MONGO_URI) {
        console.error("MONGO_URI is not defined in the environment variables.");
        return;
    }

    connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions).then(
        () => console.log("Connected to MongoDB successfully"),
        (error) => console.error("Connection error: ", error)
    );
};