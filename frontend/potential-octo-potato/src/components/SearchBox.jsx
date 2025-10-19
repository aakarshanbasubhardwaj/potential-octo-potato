import React, { useState } from 'react';
import { Box, InputBase, Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBox({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log("Searching for:", query);
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 500,
        mx: 'auto',
        mb: 2,
        mt: 2
      }}
    >
      <Paper
        component="form"
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: 3,
        }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <InputBase
          sx={{ ml: 2, flex: 1 }}
          placeholder="Search Movies or TV Shows"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        //   onKeyPress={handleKeyPress}
        />
        <IconButton
          type="submit"
          sx={{ p: '10px' }}
          aria-label="search"
        >
          <SearchIcon color="primary" />
        </IconButton>
      </Paper>
    </Box>
  );
}
