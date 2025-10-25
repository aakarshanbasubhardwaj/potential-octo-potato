import React, { useState } from 'react';
import { Box, CircularProgress } from '@mui/material';

export default function MovieImage({ path, title }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        borderRadius: '10px',
        marginTop: '1rem',
        overflow: 'hidden',
        aspectRatio: '16 / 9',
        backgroundColor: 'rgba(0,0,0,0.1)',
      }}
    >
      <img
        src={`https://image.tmdb.org/t/p/original${path}`}
        alt={title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '10px',
          display: loaded ? 'block' : 'none',
        }}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />

      {!loaded && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '10px',
            background: 'rgba(0,0,0,0.2)',
          }}
        >
          <CircularProgress color="primary" size={50} thickness={4} />
        </Box>
      )}
    </Box>
  );
}
