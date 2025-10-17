import config from '../../config/config.js'
import axios from 'axios';
import dbOperations from '../../../db/methods/dbOperations.js';
import popularMovie from '../../../db/models/popularMovieModel.js';

const { TMDB_API_KEY, TMDB_BASE_URL, REGION } = config

async function getPopularMovies() {
  console.log("Fetching Popular Movies from TMDB...")
  try {

    let page = 1;
    let totalPages = 1;
    let allMovies = [];

    while (page <= totalPages) {

      const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: { api_key: TMDB_API_KEY, language: 'en-US', page, region: REGION },
      });

      const movies = response.data.results;
      console.log("Fetched", movies.length, "movies");

      if (movies.length > 0) allMovies.push(...movies);

      if (page === 1) totalPages = Math.min(response.data.total_pages, 5);

      page++;
    }

    if (allMovies.length > 0) {
      // Delete existing records
      await dbOperations.deleteMany(popularMovie);
      console.log('Existing popular movies deleted.');

      // Insert all new movies
      await dbOperations.insertMany(popularMovie, allMovies);
      console.log('New popular movies stored!');
    } else {
      console.log('No movies fetched, nothing deleted or stored.');
    }    

  } catch (error) {
    console.error('Failed to fetch popular movies: ', error);
  }
};

export default {
  getPopularMovies
}