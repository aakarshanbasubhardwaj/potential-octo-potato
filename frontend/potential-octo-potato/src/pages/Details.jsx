import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Typography,
  Paper,
} from '@mui/material';
import MovieImage from '../components/MovieImage';

export default function MovieDetails() {
  const { id, model } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { itemType } = location.state || {};

  const endpoint =
    itemType === 'movies'
      ? 'getMovieById'
      : itemType === 'tv'
      ? 'getTvById'
      : 'getSearchById';

  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3333/${itemType}/${endpoint}?id=${id}&model=${model}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch movie details');
        return res.json();
      })
      .then(data => setMovie(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, itemType, endpoint, model]);

  if (loading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error || !movie) {
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography color="error" variant="h6">
          {error || 'Movie not found'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 8 }}> {/* space for fixed button */}
      <Container maxWidth="md" sx={{ p: 2 }}>
        <MovieImage path={movie.backdrop_path} title={movie.title} />
        <Box >        
          <Typography variant="h4" sx={{ mt: 2, fontWeight: 'bold' }}>
            {movie.title}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
            {movie.genres.join(' ')}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            {movie.release_date}
          </Typography>

          <Typography variant="caption" >
            {movie.vote_average.toFixed(1)} ⭐ ({movie.vote_count} Votes)
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ textAlign: 'justify', lineHeight: 1.6 }}>
            {movie.overview}
          </Typography>
        </Box>
      </Container>

      {/* Fixed Bottom Bar */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          backgroundColor: 'background.paper',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
          zIndex: 1200,
        }}
        elevation={3}
      >
          <Button
            variant="contained"
            fullWidth
            sx={{ color: 'white'}}
            onClick={() => navigate(`/booking/${id}`, { state: { movie } })}
          >
            Book
          </Button>
      </Paper>
    </Box>
  );
}
