import fetchMovies from './movies/index.js';
import dbOperations from '../../db/methods/dbOperations.js';
import popularMovie from '../../db/models/popularMovieModel.js';

async function fetchMoviesOnServerStart(){
    await fetchMovies.getPopularMovies()
}

async function checkModelsAndLoadData() {
    if(!dbOperations.hasData(popularMovie)){
        console.log("Popular Movies being loaded");
        fetchMoviesOnServerStart();
    } else {
        console.log("Popular Movies exist in DB");
    }
}

export default checkModelsAndLoadData