import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    throw new Error("MongoDB URI not provided in environment variables.");
}

let isConnected = false; // Track connection state

const dbConnect = async (): Promise<void> => {
    try {
        if (isConnected) {
            console.log("Using existing MongoDB connection.");
            return;
        }

        console.log("MongoDB URI:", MONGO_URL); // Debugging

        mongoose.set("strictQuery", false); // Avoid warnings
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as any); // Workaround for TypeScript

        isConnected = true;
        console.log("DB connection successful.");
    } catch (error: any) {
        console.error("Error while connecting to MongoDB:", error);
        throw error; // Preserve the original error
    }
};

export default dbConnect;