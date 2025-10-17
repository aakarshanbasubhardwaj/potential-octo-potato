import fetchMovies from './movies/index.js';

async function fetchMoviesOnServerStart(){
    await fetchMovies.getPopularMovies()
}

export default fetchMoviesOnServerStart