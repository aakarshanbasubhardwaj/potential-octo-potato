import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import MovieCard from './MovieCard';
import { ArrowForwardIos } from '@mui/icons-material';

const movieCache = {};

export default function PaginatedList({ title, model, itemType, CardComponent = MovieCard }) {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const endpoint = (itemType === "movies") ? "getMovie" : "getTv";

  const fetchData = async (page = 1) => {
    const cacheKey = `${model}-page-${page}`;

    // ✅ Check cache first
    if (movieCache[cacheKey]) {
      const cached = movieCache[cacheKey];
      setItems(prev => page === 1 ? cached.results : [...prev, ...cached.results]);
      setCurrentPage(cached.currentPage);
      setTotalPages(cached.totalPages);
      return;
    }

    // Otherwise fetch from API
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:3333/${itemType}/${endpoint}/?page=${page}&model=${model}`);
      const data = await res.json();

      // ✅ Save to cache
      movieCache[cacheKey] = data;

      setItems(prev => page === 1 ? data.results : [...prev, ...data.results]);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [model]);

  const handleNextPage = () => {
    if (currentPage < totalPages) fetchData(currentPage + 1);
  };

  return (
    <Box sx={{ mb: 3, position: 'relative' }}>
      <Typography variant="overline" sx={{ mb: 1, ml: 1 }}>
        {title}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2,
          px: 1,
          '&::-webkit-scrollbar': { display: 'none' },
          opacity: loading ? 0.5 : 1,
        }}
      >
        {items.map(item => (
          <Box key={item._id || item.id} sx={{ flex: '0 0 auto' }}>
            <CardComponent movie={item} model={model} itemType={itemType}/>
          </Box>
        ))}

        {!loading && currentPage < totalPages && (
          <Box sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
            <Button
              variant="contained"
              onClick={handleNextPage}
              sx={{ minWidth: 'auto', padding: 1 }}
            >
              <ArrowForwardIos />
            </Button>
          </Box>
        )}
      </Box>

      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
          }}
        >
          <CircularProgress size={40} />
        </Box>
      )}
    </Box>
  );
}
