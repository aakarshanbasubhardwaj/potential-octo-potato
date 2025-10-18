import { Router } from "express";
import popularMovie from '../../../db/models/popularMovieModel.js'
import dbOperations from "../../../db/methods/dbOperations.js";
import movieGenres from '../../../db/models/movieGenres.js'

const router = Router();

router.get('/popular', async (req, res) => {
  try {
    // Parse pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    // Fetch total count for pagination info
    const totalCount = await popularMovie.countDocuments();

    if (totalCount === 0) {
      return res.status(404).json({ error: 'No popular movies found' });
    }

    const genresList = await movieGenres.find({}).lean();
    const genreMap = {};
    genresList.forEach(g => {
      genreMap[g.id] = g.name;
    });


    // Get paginated results
    const popularMovies = await popularMovie
      .find({}, null, { skip, limit })
      .lean();

    const moviesWithGenreNames = popularMovies.map(movie => ({
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
    console.error('Error fetching popular movies:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.get("/getPopularMovieById", async(req, res) => {
  try {
    const result = await dbOperations.getOne(popularMovie, {_id : req.query.id});
    if(!result){
      return res.status(404).json({ message: "Movie not found" });
    }
    const genresList = await movieGenres.find({}).lean();
    const genreMap = {};
    genresList.forEach(g => {
      genreMap[g.id] = g.name;
    });
    
    result.genres = result.genre_ids.map(id => genreMap[id] || "Unknown")

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching movie by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
})

export default router;