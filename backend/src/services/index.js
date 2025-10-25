import fetchMovies from './movies/index.js';
import fetchTv from './tvShows/index.js';
import dbOperations from '../../db/methods/dbOperations.js';
import popularMovie from '../../db/models/popularMovieModel.js';
import topRatedMovie from '../../db/models/topRatedMovieModel.js';
import trendingMovie from '../../db/models/trendingMovieModel.js';
import movieGenres from '../../db/models/movieGenres.js';
import popularTvShow from '../../db/models/popularTvShowsModel.js';
import topRatedTvShow from '../../db/models/topRatedTvShowsModel.js';
import trendingTvShow from '../../db/models/trendingTvShowModel.js';
import tvGenres from '../../db/models/tvGenres.js';
import cache from '../../db/models/cacheModel.js';

async function isStale(modelName) {
  const entry = await dbOperations.getOne(cache,{ model: modelName });
  if (!entry) return true; 
  const lastFetched = entry.lastFetched ? new Date(entry.lastFetched) : 0;
  const diffHours = (Date.now() - lastFetched.getTime()) / (1000 * 60 * 60);
  return diffHours >= 24;
}

async function updateFetchTime(modelName) {
  await dbOperations.upsertOne(
    cache,
    { model: modelName },
    { lastFetched: new Date() },
  );
}

async function checkModelsAndLoadData() {
    
  const models = [
    { key: "movieGenres", hasData: () => dbOperations.hasData(movieGenres), fetch: () => fetchMovies.getMovieGenres() },
    { key: "popularMovie", hasData: () => dbOperations.hasData(popularMovie), fetch: () => fetchMovies.getPopularMovies() },
    { key: "topRatedMovie", hasData: () => dbOperations.hasData(topRatedMovie), fetch: () => fetchMovies.getTopRatedMovies() },
    { key: "trendingMovie", hasData: () => dbOperations.hasData(trendingMovie), fetch: () => fetchMovies.getTrendingMovies() },
    { key: "tvGenres", hasData: () => dbOperations.hasData(tvGenres), fetch: () => fetchTv.getTvGenres() },
    { key: "popularTvShow", hasData: () => dbOperations.hasData(popularTvShow), fetch: () => fetchTv.getPopularTv() },
    { key: "topRatedTvShow", hasData: () => dbOperations.hasData(topRatedTvShow), fetch: () => fetchTv.getTopRatedTv() },
    { key: "trendingTvShow", hasData: () => dbOperations.hasData(trendingTvShow), fetch: () => fetchTv.getTrendingTv() }
  ];

  for (const m of models) {
    const [exists, stale] = await Promise.all([m.hasData(), isStale(m.key)]);

    if (!exists || stale) {
      console.log(`${m.key} being loaded/refreshed...`);
      await m.fetch();
      await updateFetchTime(m.key);
    } else {
      console.log(`${m.key} exists in DB and is fresh`);
    }
  }
}

export default checkModelsAndLoadData