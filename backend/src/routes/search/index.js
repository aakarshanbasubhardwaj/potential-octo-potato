import express from 'express';
import dbOperations from '../../../db/methods/dbOperations.js';
import searchResult from '../../../db/models/searchResultsModel.js';
import axios from 'axios';
import config from '../../config/config.js';
import movieGenres from '../../../db/models/movieGenres.js';
import watchProviderCache from "../../../db/models/watchProviderCache.js";
import movieRuntimeCache from "../../../db/models/movieRuntimeCache.js";

const router = express.Router();

const { TMDB_API_KEY, TMDB_BASE_URL, REGION } = config

router.post('/multi', async (req, res) => {
  try {
    const { searchTerm, page = 1 } = req.body;

    if (!searchTerm) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if(page === 1){
        await dbOperations.deleteMany(searchResult);
    }

    const response = await axios.get(`${TMDB_BASE_URL}/search/multi`, {
        params: { api_key: TMDB_API_KEY, language: 'en-US', query: searchTerm, page },
    });
    
    // const results = response.data.results;

    const results = response.data.results.filter(item => item.media_type !== 'person');

    await dbOperations.insertMany(searchResult, results);

    const returnResponse = await dbOperations.getAll(searchResult)

    const genresList = await movieGenres.find({}).lean();
      const genreMap = {};
      genresList.forEach(g => {
        genreMap[g.id] = g.name;
      });
      const moviesWithGenreNames = returnResponse.map(movie => ({
        ...movie,
        genres: movie.genre_ids.map(id => genreMap[id] || "Unknown")
      }));

      return res.status(200).json({
        results: moviesWithGenreNames
      });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get("/getSearchById", async(req, res) => {
  try {
    let result;

    result = await dbOperations.getOne(searchResult, {_id : req.query.id});
    if(!result){
      return res.status(404).json({ message: "Search item not found" });
    }
    
    const genresList = await movieGenres.find({}).lean();
    const genreMap = {};
    genresList.forEach(g => {
      genreMap[g.id] = g.name;
    });

    const type = result.media_type

    const cachedRuntime = await dbOperations.getOne(movieRuntimeCache, { id: result.id });
    if (cachedRuntime) {
      result.runtime = cachedRuntime.runtime;
    } else {
      const runtimeResponse = await axios.get(`${TMDB_BASE_URL}/${type}/${result.id}`, {
        params: { api_key: TMDB_API_KEY, language: "en-US" },
      });
      result.runtime = runtimeResponse.data.runtime || null;
      await dbOperations.insertOne(movieRuntimeCache, {
        id: result.id,
        runtime: result.runtime,
      });
    }  

    const cachedProvider = await dbOperations.getOne(watchProviderCache, { id: result.id });
    if (cachedProvider) {
      result.provider = cachedProvider.provider;
    } else {
      const providerResponse = await axios.get(`${TMDB_BASE_URL}/${type}/${result.id}/watch/providers`, {
        params: { api_key: TMDB_API_KEY, language: "en-US" },
      });
      
      const regionalProvider = providerResponse.data.results?.[REGION]?.flatrate;

      result.provider = regionalProvider ? regionalProvider : "Streaming data unavailable"
      await dbOperations.insertOne(watchProviderCache, {
        id: result.id,
        provider: result.provider,
      });
    } 

    result.genres = result.genre_ids.map(id => genreMap[id] || "Unknown")

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching search item by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
})

export default router;
