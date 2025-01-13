import mongoose from "mongoose";

const dbConnect = async (): Promise<void> => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error("MongoDB URI not provided in environment variables.");
        }

        console.log('MongoDB URI:', process.env.MONGO_URL);  // Debug the URI

        await mongoose.connect(process.env.MONGO_URL);
        console.log("DB connection successful.");
    } catch (error: any) {
        console.error('Error while connecting to MongoDB:', error.stack || error.message);
        throw new Error("Error while connecting to DB.");
    }
}

export default dbConnect;