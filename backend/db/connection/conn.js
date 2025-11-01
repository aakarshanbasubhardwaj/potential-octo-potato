import mongoose from "mongoose";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const MONGO_URI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI_PROD
    : process.env.MONGO_URI_DEV;

async function connectToDatabase(){
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB - potential-octo-potato");
    } catch (error) {
        console.error("Error connecting to MongoDB - potential-octo-potato", error);
        process.exit(1);
    }

    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
    });
}

export default { connectToDatabase };