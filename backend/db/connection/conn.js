import mongoose from "mongoose";

async function connectToDatabase(){
    try {
        await mongoose.connect("mongodb://localhost:27017/potential-octo-potato");
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