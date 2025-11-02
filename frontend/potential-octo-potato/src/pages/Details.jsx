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
import {API_BASE_URL} from '../config/config.js';

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
    fetch(`${API_BASE_URL}/${itemType}/${endpoint}?id=${id}&model=${model}`)
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
      <Box 
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',   
        height: '100vh',         
      }}>
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

          <Typography variant="subtitle2" sx={{ mt: 1 }}>
            {movie.genres.join(' | ')}
          </Typography>

          <Typography variant="caption"  sx={{ mb: 1 }}>
            {movie.release_date}
          </Typography>

          {movie.runtime ? <Typography variant="subtitle2" sx={{ mt: 1 }}>
            {movie.runtime} mins
          </Typography>: null}

          <Typography variant="caption" >
            {movie.vote_average.toFixed(1)} ⭐ ({movie.vote_count} Votes)
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ textAlign: 'justify', lineHeight: 1.6 }}>
            {movie.overview}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mt: 1 }}>
            {movie.provider.length > 0 &&typeof movie.provider[0] === "object" &&
            <Typography
              variant="overline"
              sx={{
                letterSpacing: 0.5,
                color: "text.secondary",
                fontWeight: 600,
                textTransform: "uppercase",
                mb: 1,
              }}
            >
              Now Streaming
            </Typography>}
            
            {Array.isArray(movie.provider) &&
            movie.provider.length > 0 &&
            typeof movie.provider[0] === "object" ? (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {movie.provider.map((prov) => (
                  <Box
                    key={prov.provider_id}
                    component="img"
                    src={`https://image.tmdb.org/t/p/w92${prov.logo_path}`}
                    alt={prov.provider_name}
                    title={prov.provider_name}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      objectFit: "contain",
                      p: 0.5,
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Streaming data unavailable
              </Typography>
            )}
          </Box>

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
          pb: `calc(2rem + env(safe-area-inset-bottom))`,
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
            onClick={() => navigate(`/booking/${id}`, { state: { movie, model } })}
          >
            Book
          </Button>
      </Paper>
    </Box>
  );
}
