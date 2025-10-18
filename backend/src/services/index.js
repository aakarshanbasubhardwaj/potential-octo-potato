import fetchMovies from './movies/index.js';
import dbOperations from '../../db/methods/dbOperations.js';
import popularMovie from '../../db/models/popularMovieModel.js';
import movieGenres from '../../db/models/movieGenres.js';

async function fetchMoviesOnServerStart(){
    await fetchMovies.getPopularMovies()
}

async function checkModelsAndLoadData() {
    if(! await dbOperations.hasData(movieGenres)){
        console.log("Movie Genres being loaded");
        await fetchMovies.getMovieGenres();
    } else {
        console.log("Movie Genres exist in DB");
    }
    if(! await dbOperations.hasData(popularMovie)){
        console.log("Popular Movies being loaded");
        fetchMoviesOnServerStart();
    } else {
        console.log("Popular Movies exist in DB");
    }
}

export default checkModelsAndLoadData