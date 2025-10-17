import { Router } from "express";
import popularMovie from '../../../db/models/popularMovieModel.js'
import dbOperations from "../../../db/methods/dbOperations.js";

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

    // Get paginated results
    const popularMovies = await popularMovie
      .find({}, null, { skip, limit })
      .lean();

    return res.status(200).json({
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalResults: totalCount,
      results: popularMovies
    });

  } catch (err) {
    console.error('Error fetching popular movies:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;