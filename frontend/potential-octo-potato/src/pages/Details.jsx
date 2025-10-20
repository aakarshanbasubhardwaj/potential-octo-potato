import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MovieDetails() {
  const navigate = useNavigate();
  const { id, model } = useParams();
  const [movie, setMovie] = useState(null);
  const location = useLocation();
  const { itemType } = location.state;
  const endpoint = (itemType === "movies") ? "getMovieById" : (itemType === "tv") ? "getTvById" : "getSearchById";

  useEffect(() => {
    fetch(`http://localhost:3333/${itemType}/${endpoint}?id=${id}&model=${model}`)
      .then(res => res.json())
      .then(data => setMovie(data))
      .catch(console.error);
  }, [id]);

  if (!movie) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <img
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={movie.title}
        style={{ width: '100%', borderRadius: '10px', marginTop: '1rem' }}
      />
      <Typography variant="h4">{movie.title}</Typography>
      <Typography sx={{ mt: 1 }} >{movie.genres.join(' ')}</Typography>
      <Typography variant="body2" >
        {movie.vote_average} ⭐ ({movie.vote_count} Votes)
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
        {movie.release_date}
      </Typography>

      <Typography sx={{ mt: 2, textAlign: 'justify' }}>{movie.overview}</Typography>

      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          p: 2,
          bgcolor: 'background.paper',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Button variant="contained" color="primary" fullWidth onClick={() => navigate(`/booking/${id}`, { state: { movie } })}>
          Book
        </Button>
      </Box>
    </Box>
  );
}
