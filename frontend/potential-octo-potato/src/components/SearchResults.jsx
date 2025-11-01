import React, { useState } from 'react';
import { Box, Grid, Button } from '@mui/material';
import MovieCard from './MovieCard';
import {API_BASE_URL} from '../config/config.js';

export default function SearchResults({ searchTerm, model, initialResults = [] }) {
  const [results, setResults] = useState(initialResults);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadNextPage = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/search/multi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ searchTerm, page: page + 1 }),
      });

      const data = await res.json();
      setResults(prev => [...prev, ...data.results]); 
      setPage(prev => prev + 1);
    } catch (err) {
      console.error('Error loading next page:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2} justifyContent="space-evenly">
        {results.map(movie => (
          <Grid item xs={6} key={movie._id} >
            <MovieCard movie={movie} model={model} itemType={"search"}/>
          </Grid>
        ))}
      </Grid>

      {results.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button
            variant="text"
            onClick={loadNextPage}
            disabled={loading}
            color="secondary"
            >
            {loading ? 'Loading...' : 'More'}
          </Button>

        </Box>
      )}
    </Box>
  );
}
