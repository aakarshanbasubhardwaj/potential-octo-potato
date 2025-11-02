import express from 'express';
import cors from 'cors';
import conn from '../db/connection/conn.js';
import movies from './routes/movies/index.js';
import tickets from './routes/tickets/index.js';
import tv from './routes/tvShows/index.js';
import search from './routes/search/index.js';
import checkModelsAndLoadData from './services/index.js';
import nextShow from './routes/nextShow/index.js';
import bookings from './routes/booking/index.js'
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors())
const PORT = process.env.PORT;

app.use(express.json());

app.get("/test", (req, res) => {
    res.status(200).json({ message: "Test Successful"})
});

app.use("/movies", movies);
app.use("/tickets", tickets);
app.use("/tv", tv);
app.use("/search", search);
app.use("/nextShow", nextShow);
app.use("/bookings", bookings);

await conn.connectToDatabase();

async function loadInitialData(){
  console.log("Loading initial data...");
  await checkModelsAndLoadData();

  const oneDayMs = 24 * 60 * 60 * 1000;
  setInterval(async () => {
    console.log("Daily data refresh triggered...");
    try {
      await checkModelsAndLoadData();
    } catch (err) {
      console.error("Error during daily refresh:", err);
    }
  }, oneDayMs);
}

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Running on port: ${PORT}`);
});

loadInitialData()