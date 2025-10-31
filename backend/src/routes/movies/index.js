import { Router } from "express";
import popularMovie from '../../../db/models/popularMovieModel.js';
import topRatedMovie from '../../../db/models/topRatedMovieModel.js';
import trendingMovie from '../../../db/models/trendingMovieModel.js';
import dbOperations from "../../../db/methods/dbOperations.js";
import movieGenres from '../../../db/models/movieGenres.js';
import axios from 'axios';
import config from "../../config/config.js";
import movieRuntimeCache from "../../../db/models/movieRuntimeCache.js";
import watchProviderCache from "../../../db/models/watchProviderCache.js";

const router = Router();

const { TMDB_API_KEY, TMDB_BASE_URL, REGION } = config

router.get('/getMovie', async (req, res) => {
  try {
    // Parse pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const requestedModel = req.query.model;
    let movies;
    let totalCount;

    if (requestedModel === "popularMovie"){
      // Fetch total count for pagination info
      totalCount = await popularMovie.countDocuments();

      if (totalCount === 0) {
        return res.status(404).json({ error: 'No popular movies found' });
      }
      // Get paginated results
      movies = await popularMovie
        .find({}, null, { skip, limit })
        .lean();
    } else if ( requestedModel === "topRatedMovie") {
      // Fetch total count for pagination info
      totalCount = await topRatedMovie.countDocuments();

      if (totalCount === 0) {
        return res.status(404).json({ error: 'No Top Rated Movies found' });
      }

      // Get paginated results
      movies = await topRatedMovie
        .find({}, null, { skip, limit })
        .lean();
    } else if ( requestedModel === "trendingMovie") {
      // Fetch total count for pagination info
      totalCount = await trendingMovie.countDocuments();

      if (totalCount === 0) {
        return res.status(404).json({ error: 'No Trending Movies found' });
      }

      // Get paginated results
      movies = await trendingMovie
        .find({}, null, { skip, limit })
        .lean();
    } else {
      return res.status(400).json({ error: 'Incorrect parameters' });
    }
    const genresList = await movieGenres.find({}).lean();
      const genreMap = {};
      genresList.forEach(g => {
        genreMap[g.id] = g.name;
      });
    const moviesWithGenreNames = movies.map(movie => ({
      ...movie,
      genres: movie.genre_ids.map(id => genreMap[id] || "Unknown")
    }));

    return res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalResults: totalCount,
      results: moviesWithGenreNames
    });
  } catch (err) {
    console.error(`Error fetching ${req.query.model} movies:`, err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get("/getMovieById", async(req, res) => {
  try {
    const requestedModel = req.query.model;
    let result;
    if(requestedModel === "popularMovie"){
      result = await dbOperations.getOne(popularMovie, {_id : req.query.id});
      if(!result){
        return res.status(404).json({ message: "Movie not found" });
      }
    } else if (requestedModel === 'topRatedMovie'){
      result = await dbOperations.getOne(topRatedMovie, {_id : req.query.id});
      if(!result){
        return res.status(404).json({ message: "Movie not found" });
      }
    } else if (requestedModel === 'trendingMovie'){
      result = await dbOperations.getOne(trendingMovie, {_id : req.query.id});
      if(!result){
        return res.status(404).json({ message: "Movie not found" });
      }
    } else {
      return res.status(400).json({ error: 'Incorrect parameters' });
    }

    const genresList = await movieGenres.find({}).lean();
    const genreMap = {};
    genresList.forEach(g => {
      genreMap[g.id] = g.name;
    });

    const cachedRuntime = await dbOperations.getOne(movieRuntimeCache, { id: result.id });
    if (cachedRuntime) {
      result.runtime = cachedRuntime.runtime;
    } else {
      const runtimeResponse = await axios.get(`${TMDB_BASE_URL}/movie/${result.id}`, {
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
      const providerResponse = await axios.get(`${TMDB_BASE_URL}/movie/${result.id}/watch/providers`, {
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
    console.error("Error fetching movie by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
})

export default router;