import express from 'express';
import cors from 'cors';
import conn from '../db/connection/conn.js';
import movies from './routes/movies/index.js';
// import tvShows from './routes/tvShows/index.js';
import checkModelsAndLoadData from './services/index.js'

const app = express();
app.use(cors())
const PORT = 3333;

app.use(express.json());

app.get("/test", (req, res) => {
    res.status(200).json({ message: "Test Successful"})
});

app.use("/movies", movies);
// app.use("/tvShows", tvShows);

await conn.connectToDatabase();

async function loadInitialData(){
  console.log("Loading initial data...");
  await checkModelsAndLoadData();
}

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});

loadInitialData()