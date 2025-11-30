import dotenv from "dotenv";

dotenv.config();

const REGION = process.env.REGION;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const YT_API_KEY = process.env.YT_API_KEY;

export default {
    "TMDB_API_KEY" : TMDB_API_KEY,
    "TMDB_BASE_URL" : "https://api.themoviedb.org/3",
    "REGION" : REGION,
    "YT_API_KEY": YT_API_KEY,
}