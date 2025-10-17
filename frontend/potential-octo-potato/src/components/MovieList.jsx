import React from 'react';
import { Box, Typography } from '@mui/material';
import MovieCard from './MovieCard';

export default function MovieList({ movies }) {
  if (!movies || movies.length === 0) {
    return <Typography variant="body1">No popular movies available</Typography>;
  }

  return (
    <Box sx={{ mb: 3 }}>
      {/* Section title */}
      <Typography variant="h6" sx={{ mb: 1, ml: 1 }}>
        Popular Movies
      </Typography>

      {/* Horizontally scrollable container */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2,
          px: 1,
          '&::-webkit-scrollbar': { display: 'none' }, // hide scrollbar
        }}
      >
        {movies.map(movie => (
          <Box key={movie._id || movie.id} sx={{ flex: '0 0 auto' }}>
            <MovieCard movie={movie} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
