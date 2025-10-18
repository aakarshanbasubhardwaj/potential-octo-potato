import { useEffect, useState } from 'react';
import MovieList from '../components/MovieList';

export default function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3333/movies/popular')
      .then(res => res.json())
      .then(data => setMovies(data.results))
      .catch(err => console.error(err));
  }, []);

  return <MovieList movies={movies} />;
}
