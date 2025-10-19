import config from '../../config/config.js'
import axios from 'axios';
import dbOperations from '../../../db/methods/dbOperations.js';
import popularTvShow from '../../../db/models/popularTvShowsModel.js';
import topRatedTvShow from '../../../db/models/topRatedTvShowsModel.js';
import trendingTvShow from '../../../db/models/trendingTvShowModel.js';
import tvGenres from '../../../db/models/tvGenres.js';

const { TMDB_API_KEY, TMDB_BASE_URL, REGION } = config

async function getTvGenres() {
  console.log("Fetching TV Genres from TMDB...")
  try {
    let allTvGenres = [];


    const response = await axios.get(`${TMDB_BASE_URL}/genre/tv/list?language=en`, {
      params: { api_key: TMDB_API_KEY, language: 'en-US', region: REGION },
    });

    const fetchedTvGenres = response.data.genres;
    console.log("Fetched", fetchedTvGenres.length, "tv genres");

    if (fetchedTvGenres.length > 0) allTvGenres.push(...fetchedTvGenres);

    

    if (allTvGenres.length > 0) {
      // Delete existing records
      await dbOperations.deleteMany(tvGenres);
      console.log('Existing tv genres deleted.');

      // Insert all new movies
      await dbOperations.insertMany(tvGenres, allTvGenres);
      console.log('New tv genres stored!');
    } else {
      console.log('No tv genres fetched, nothing deleted or stored.');
    }    

  } catch (error) {
    console.error('Failed to fetch tv genres: ', error);
  }
};

async function getPopularTv() {
  console.log("Fetching Popular Tv from TMDB...")
  try {

    let page = 1;
    let totalPages = 1;
    let allTv = [];

    while (page <= totalPages) {

      const response = await axios.get(`${TMDB_BASE_URL}/tv/popular`, {
        params: { api_key: TMDB_API_KEY, language: 'en-US', page, region: REGION },
      });

      const tv = response.data.results;
      console.log("Fetched", tv.length, "tv");

      if (tv.length > 0) allTv.push(...tv);

      if (page === 1) totalPages = Math.min(response.data.total_pages, 1);

      page++;
    }

    if (allTv.length > 0) {
      // Delete existing records
      await dbOperations.deleteMany(popularTvShow);
      console.log('Existing popular tv deleted.');

      // Insert all new movies
      await dbOperations.insertMany(popularTvShow, allTv);
      console.log('New popular tv stored!');
    } else {
      console.log('No tv fetched, nothing deleted or stored.');
    }    

  } catch (error) {
    console.error('Failed to fetch popular tv: ', error);
  }
};

async function getTopRatedTv() {
  console.log("Fetching Top Rated Tv from TMDB...")
  try {

    let page = 1;
    let totalPages = 1;
    let allTv = [];

    while (page <= totalPages) {

      const response = await axios.get(`${TMDB_BASE_URL}/tv/top_rated`, {
        params: { api_key: TMDB_API_KEY, language: 'en-US', page, region: REGION },
      });

      const tv = response.data.results;
      console.log("Fetched", tv.length, "tv");

      if (tv.length > 0) allTv.push(...tv);

      if (page === 1) totalPages = Math.min(response.data.total_pages, 1);

      page++;
    }

    if (allTv.length > 0) {
      // Delete existing records
      await dbOperations.deleteMany(topRatedTvShow);
      console.log('Existing top rated tv deleted.');

      // Insert all new movies
      await dbOperations.insertMany(topRatedTvShow, allTv);
      console.log('New top rated tv stored!');
    } else {
      console.log('No tv fetched, nothing deleted or stored.');
    }    

  } catch (error) {
    console.error('Failed to fetch top rated tv: ', error);
  }
};

async function getTrendingTv() {
  console.log("Fetching Trending Movies from TMDB...")
  try {

    let page = 1;
    let totalPages = 1;
    let allTv = [];

    while (page <= totalPages) {

      const response = await axios.get(`${TMDB_BASE_URL}/trending/tv/week`, {
        params: { api_key: TMDB_API_KEY, language: 'en-US', page, region: REGION },
      });

      const tv = response.data.results;
      console.log("Fetched", tv.length, "tv");

      if (tv.length > 0) allTv.push(...tv);

      if (page === 1) totalPages = Math.min(response.data.total_pages, 1);

      page++;
    }

    if (allTv.length > 0) {
      // Delete existing records
      await dbOperations.deleteMany(trendingTvShow);
      console.log('Existing trending tv deleted.');

      // Insert all new movies
      await dbOperations.insertMany(trendingTvShow, allTv);
      console.log('New trending tv stored!');
    } else {
      console.log('No tv fetched, nothing deleted or stored.');
    }    

  } catch (error) {
    console.error('Failed to fetch trending tv: ', error);
  }
};

export default {
  getTvGenres,
  getPopularTv,
  getTopRatedTv,
  getTrendingTv
}