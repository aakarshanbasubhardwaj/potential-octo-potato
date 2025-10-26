import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Skeleton } from '@mui/material';
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

    if (movieCache[cacheKey]) {
      const cached = movieCache[cacheKey];
      setItems(prev => page === 1 ? cached.results : [...prev, ...cached.results]);
      setCurrentPage(cached.currentPage);
      setTotalPages(cached.totalPages);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`http://10.0.0.1:3333/${itemType}/${endpoint}/?page=${page}&model=${model}`);
      const data = await res.json();
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

  const skeletonCount = 6;

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
        {loading && items.length === 0
          ? Array.from({ length: skeletonCount }).map((_, index) => (
              <Box key={index} sx={{ flex: '0 0 auto', width: 150 }}>
                <Skeleton variant="rectangular" height={225} sx={{ borderRadius: 1 }} />
                <Skeleton variant="text" sx={{ mt: 1 }} />
                <Skeleton variant="text" width="60%" />
              </Box>
            ))
          : items.map(item => (
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
              <ArrowForwardIos sx={{ color: 'white' }} />
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
