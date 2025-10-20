import { Router } from "express";
import dbOperations from "../../../db/methods/dbOperations.js";
import popularTvShow from '../../../db/models/popularTvShowsModel.js';
import topRatedTvShow from '../../../db/models/topRatedTvShowsModel.js';
import trendingTvShow from '../../../db/models/trendingTvShowModel.js';
import tvGenres from '../../../db/models/tvGenres.js';

const router = Router();

router.get('/getTv', async (req, res) => {
  try {
    // Parse pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const requestedModel = req.query.model;
    let tvShows;
    let totalCount;

    if (requestedModel === "popularTv"){
      // Fetch total count for pagination info
      totalCount = await popularTvShow.countDocuments();

      if (totalCount === 0) {
        return res.status(404).json({ error: 'No popular tv found' });
      }
      // Get paginated results
      tvShows = await popularTvShow
        .find({}, null, { skip, limit })
        .lean();
    } else if ( requestedModel === "topRatedTv") {
      // Fetch total count for pagination info
      totalCount = await topRatedTvShow.countDocuments();

      if (totalCount === 0) {
        return res.status(404).json({ error: 'No Top Rated Tv found' });
      }

      // Get paginated results
      tvShows = await topRatedTvShow
        .find({}, null, { skip, limit })
        .lean();
    } else if ( requestedModel === "trendingTv") {
      // Fetch total count for pagination info
      totalCount = await trendingTvShow.countDocuments();

      if (totalCount === 0) {
        return res.status(404).json({ error: 'No Trending Tv found' });
      }

      // Get paginated results
      tvShows = await trendingTvShow
        .find({}, null, { skip, limit })
        .lean();
    } else {
      return res.status(400).json({ error: 'Incorrect parameters' });
    }
    const genresList = await tvGenres.find({}).lean();
      const genreMap = {};
      genresList.forEach(g => {
        genreMap[g.id] = g.name;
      });
      const TvWithGenreNames = tvShows.map(tv => ({
        ...tv,
        title: tv.name,
        genres: tv.genre_ids.map(id => genreMap[id] || "Unknown")
      }));

      return res.status(200).json({
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalResults: totalCount,
        results: TvWithGenreNames
      });
  } catch (err) {
    console.error(`Error fetching ${req.query.model} Tv:`, err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get("/getTvById", async(req, res) => {
  try {
    const requestedModel = req.query.model;
    let result;
    if(requestedModel === "popularTv"){
      result = await dbOperations.getOne(popularTvShow, {_id : req.query.id});
      if(!result){
        return res.status(404).json({ message: "Tv not found" });
      }
    } else if (requestedModel === 'topRatedTv'){
      result = await dbOperations.getOne(topRatedTvShow, {_id : req.query.id});
      if(!result){
        return res.status(404).json({ message: "Tv not found" });
      }
    } else if (requestedModel === 'trendingTv'){
      result = await dbOperations.getOne(trendingTvShow, {_id : req.query.id});
      if(!result){
        return res.status(404).json({ message: "Tv not found" });
      }
    } else {
      return res.status(400).json({ error: 'Incorrect parameters' });
    }

    const genresList = await tvGenres.find({}).lean();
    const genreMap = {};
    genresList.forEach(g => {
      genreMap[g.id] = g.name;
    });
    
    result.genres = result.genre_ids.map(id => genreMap[id] || "Unknown")
    result.title = result.name;

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching Tv by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
})

export default router;