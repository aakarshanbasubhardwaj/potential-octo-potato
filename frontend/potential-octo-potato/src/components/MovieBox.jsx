import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Ticket({ movie }) {
  const { title, poster_path, release_date, runtime, vote_average, vote_count } = movie;

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
        <Box>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
            {title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#ddd' }}>
             {release_date}{/* • {runtime} min */}
            </Typography>
            <Typography variant="body2" sx={{ color: '#ddd' }}>
            {vote_average} ⭐ ({vote_count} Votes)
            </Typography>
        </Box>
        </Box>
  );
}

