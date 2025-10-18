import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import MovieCard from './MovieCard';
import { ArrowForwardIos } from '@mui/icons-material';

export default function PaginatedList({ title, apiEndpoint, CardComponent = MovieCard }) {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`${apiEndpoint}?page=${page}`);
      const data = await res.json();
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
  }, [apiEndpoint]);

  const handleNextPage = () => {
    if (currentPage < totalPages) fetchData(currentPage + 1);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 1, ml: 1 }}>
        {title}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2,
          px: 1,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {items.map(item => (
          <Box key={item._id || item.id} sx={{ flex: '0 0 auto' }}>
            <CardComponent movie={item} />
          </Box>
        ))}

        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
            <CircularProgress size={30} />
          </Box>
        )}

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
    </Box>
  );
}
