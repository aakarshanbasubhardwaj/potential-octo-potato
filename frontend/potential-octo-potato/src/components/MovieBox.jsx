import React from 'react';
import { Box, Typography } from '@mui/material';

export default function MovieBox({ movie }) {
  const { title, poster_path, release_date, vote_average, vote_count } = movie;

  return (
    
    <Box
        sx={{
            position: 'absolute',
            top: 20,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            zIndex: 1,
            borderRadius: 2,
            px: 2,
            py: 1,
        }}
        >
        <Box
            component="img"
            src={`https://image.tmdb.org/t/p/w92${poster_path}`}
            alt={title}
            sx={{ borderRadius: 1 }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column'}}>
            <Typography variant="h5" sx={{ color: '#fff',  }}>
            {title}
            </Typography>
            <Typography variant="caption" color="#ddd" sx={{ mt: 1 }}>
                {movie.genres.join(' ')}
            </Typography>
            <Typography variant="caption" sx={{ color: '#ddd' }}>
             {release_date}{/* • {runtime} min */}
            </Typography>
            <Typography variant="caption" sx={{ color: '#ddd' }}>
            {vote_average.toFixed(1)} ⭐ ({vote_count} Votes)
            </Typography>
        </Box>
        </Box>
  );
}
