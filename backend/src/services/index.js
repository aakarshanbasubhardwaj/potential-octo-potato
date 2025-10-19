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

async function checkModelsAndLoadData() {
    if(! await dbOperations.hasData(movieGenres)){
        console.log("Movie Genres being loaded");
        await fetchMovies.getMovieGenres();
    } else {
        console.log("Movie Genres exist in DB");
    }
    if(! await dbOperations.hasData(popularMovie)){
        console.log("Popular Movies being loaded");
        await fetchMovies.getPopularMovies();
    } else {
        console.log("Popular Movies exist in DB");
    }
    if(! await dbOperations.hasData(topRatedMovie)){
        console.log("Top Rated Movies being loaded");
        await fetchMovies.getTopRatedMovies();
    } else {
        console.log("Top Rated Movies exist in DB");
    }
    if(! await dbOperations.hasData(trendingMovie)){
        console.log("Trending Movies being loaded");
        await fetchMovies.getTrendingMovies();
    } else {
        console.log("Trending Movies exist in DB");
    }
    if(! await dbOperations.hasData(tvGenres)){
        console.log("Tv Show Genres being loaded");
        await fetchTv.getTvGenres();
    } else {
        console.log("Tv Show Genres exist in DB");
    }
    if(! await dbOperations.hasData(popularTvShow)){
        console.log("Popular Tv Show being loaded");
        await fetchTv.getPopularTv();
    } else {
        console.log("Popular Tv Show exist in DB");
    }
    if(! await dbOperations.hasData(topRatedTvShow)){
        console.log("Top Rated Tv Show being loaded");
        await fetchTv.getTopRatedTv();
    } else {
        console.log("Top Rated Tv Show exist in DB");
    }
    if(! await dbOperations.hasData(trendingTvShow)){
        console.log("Trending Tv Show being loaded");
        await fetchTv.getTrendingTv();
    } else {
        console.log("Trending Tv Show exist in DB");
    }
}

export default checkModelsAndLoadData