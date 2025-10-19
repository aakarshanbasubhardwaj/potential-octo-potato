import fetchMovies from './movies/index.js';
import dbOperations from '../../db/methods/dbOperations.js';
import popularMovie from '../../db/models/popularMovieModel.js';
import topRatedMovie from '../../db/models/topRatedMovieModel.js';
import trendingMovie from '../../db/models/trendingMovieModel.js';
import movieGenres from '../../db/models/movieGenres.js';

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
}

export default checkModelsAndLoadData