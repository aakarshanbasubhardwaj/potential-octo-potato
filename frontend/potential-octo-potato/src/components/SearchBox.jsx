import React, { useState } from 'react';
import { Box, InputBase, Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export default function SearchBox({ onSearch }) {
  const [query, setQuery] = useState('');
  // const [results, setResults] = useState();

  const handleClear = () => {
    setQuery('');
    // setResults([]);
    if (onSearch) onSearch([],'');
  };

  const handleSearch = async () => {
    try {
      if(query){
        const res = await fetch('http://10.0.0.1:3333/search/multi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            searchTerm: query,
            page: 1
          }),
        });
        
        const data = await res.json();

        // console.log(data.returnResponse)
        // setResults(data.returnResponse);
        if (onSearch) onSearch(data.results,query);
      }
    } catch (error) {
      console.error('Error during search:', error);
    }
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
        {query && (
          <IconButton
            size="small"
            sx={{ p: '4px' }}
            aria-label="clear"
            onClick={handleClear}
          >
            <ClearIcon color="secondary"  sx={{ fontSize: 16}} />
          </IconButton>
        )}
        <IconButton
          type="submit"
          sx={{ p: '10px' }}
          aria-label="search"
          disabled={!query.trim()}
        >
          <SearchIcon color="primary" />
        </IconButton>
      </Paper>
    </Box>
  );
}
