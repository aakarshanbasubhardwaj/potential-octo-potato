import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';

export default function BottomNavLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [value, setValue] = useState(location.pathname === '/bookingHistory' ? 1 : 0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (newValue === 0) navigate('/');
    if (newValue === 1) navigate('/bookingHistory');
  };

  return (
    <Box sx={{ pb: 8, position: 'relative', minHeight: '100vh' }}>
      {/* Page content */}
      {children}

      {/* Floating Bottom Navigation */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90%',
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: '0px 8px 16px rgba(0,0,0,0.2)',
          overflow: 'hidden',
        }}
        elevation={3}
      >
        <BottomNavigation
          value={value}
          onChange={handleChange}
          showLabels
          sx={{
            bgcolor: 'white',
            borderRadius: 3,
          }}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} showLabel={value === 0} />
          <BottomNavigationAction label="Booking History" icon={<HistoryIcon />} showLabel={value === 1}/>
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
