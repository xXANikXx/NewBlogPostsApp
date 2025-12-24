import {SETTINGS} from "../core/settings/settings";
import mongoose from "mongoose";

export async function runDB(): Promise<void> {
    try {
        await mongoose.connect(SETTINGS.MONGO_URL, {
            dbName: SETTINGS.DB_NAME,
        });

        console.log("✅ Connected to MongoDB via Mongoose");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        await mongoose.disconnect();
    }
}

export async function stopDb() {
    await mongoose.disconnect();
}