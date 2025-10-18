import config from '../../config/config.js'
import axios from 'axios';
import dbOperations from '../../../db/methods/dbOperations.js';
import popularMovie from '../../../db/models/popularMovieModel.js';
import movieGenres from '../../../db/models/movieGenres.js';

const { TMDB_API_KEY, TMDB_BASE_URL, REGION } = config

async function getMovieGenres() {
  console.log("Fetching Movie Genres from TMDB...")
  try {
    let allMovieGenres = [];


    const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?language=en`, {
      params: { api_key: TMDB_API_KEY, language: 'en-US', region: REGION },
    });

    const fetchedMovieGenres = response.data.genres;
    console.log("Fetched", fetchedMovieGenres.length, "movie genres");

    if (fetchedMovieGenres.length > 0) allMovieGenres.push(...fetchedMovieGenres);

    

    if (allMovieGenres.length > 0) {
      // Delete existing records
      await dbOperations.deleteMany(movieGenres);
      console.log('Existing movie genres deleted.');

      // Insert all new movies
      await dbOperations.insertMany(movieGenres, allMovieGenres);
      console.log('New movie genres stored!');
    } else {
      console.log('No movie genres fetched, nothing deleted or stored.');
    }    

  } catch (error) {
    console.error('Failed to fetch movie genres: ', error);
  }
};

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
  getMovieGenres,
  getPopularMovies
}