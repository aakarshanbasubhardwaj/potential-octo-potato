import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, CircularProgress  } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MovieBox from '../components/MovieBox.jsx';

export default function BookingPage() {
  const theme = useTheme();  
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie;

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [tickets, setTickets] = useState(2);

  const dateRef = useRef(null);
  const timeRef = useRef(null);
  const dateItemRefs = useRef([]);

  const [loading, setLoading] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false); 

  const handleConfirmBooking = async () => {
    setLoading(true);
    try {
        const res = await fetch('http://localhost:3333/tickets/createTicket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: movie.title,
            date: selectedDate,
            time: selectedTime,
            tickets,
            poster_path: movie.poster_path,
            backdrop_path: movie.backdrop_path
        }),
        });

        const data = await res.json();

        if (res.ok) {
        navigate(`/confirmation/${data.confirmationNumber}`, { replace: true });
        } else {
        console.error(data.error);
        alert('Booking failed: ' + data.error);
        }
    } catch (err) {
        console.error(err);
        alert('Booking failed: ' + err.message);
    } finally {
        setLoading(false);
    }
};


  if (!movie) return <Typography>Movie data not available.</Typography>;

  // Generate 14 days from today
  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  // Generate times every 30 mins
  const times = Array.from({ length: 48 }, (_, i) => {
    const h = Math.floor(i / 2);
    const m = i % 2 === 0 ? '00' : '30';
    return `${String(h).padStart(2, '0')}:${m}`;
  });

//   const formatDate = (d) =>
//     `${d.toLocaleString('en-US', { weekday: 'short' }).toUpperCase()} ${String(
//       d.getDate()
//     ).padStart(2, '0')} ${d.toLocaleString('default', { month: 'short' }).toUpperCase()}`;
// Format date as "Oct 18, 2025"
const formatDate = (d) =>
  `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}, ${d.getFullYear()}`;


  // Initialize default date and closest time
  useEffect(() => {
    setSelectedDate(formatDate(dates[0]));

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const closestIndex = times.findIndex((t) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m >= currentMinutes;
    });
    setSelectedTime(times[closestIndex] || times[0]);
  }, []);

  // Auto-scroll function to center selected item
  const scrollToCenter = (containerRef, itemRef) => {
    if (containerRef.current && itemRef) {
      const container = containerRef.current;
      const itemTop = itemRef.offsetTop;
      const itemHeight = itemRef.offsetHeight;
      const containerHeight = container.clientHeight;
      const scrollPos = itemTop - containerHeight / 2 + itemHeight / 2;
      container.scrollTo({
        top: scrollPos,
        behavior: 'smooth',
      });
    }
  };

  // Scroll whenever selected date changes
  useEffect(() => {
    const index = dates.findIndex((d) => formatDate(d) === selectedDate);
    if (index >= 0 && dateItemRefs.current[index]) {
      scrollToCenter(dateRef, dateItemRefs.current[index]);
    }
  }, [selectedDate]);

  // Scroll whenever selected time changes
  useEffect(() => {
    const index = times.findIndex((t) => t === selectedTime);
    if (index >= 0 && timeRef.current) {
      const container = timeRef.current;
      const itemHeight = 50; // adjust to your item height
      const visibleItems = 3;
      container.scrollTo({
        top: itemHeight * index - (itemHeight * visibleItems) / 2,
        behavior: 'smooth',
      });
    }
  }, [selectedTime]);

  const incrementTickets = () => tickets < 10 && setTickets(tickets + 1);
  const decrementTickets = () => tickets > 2 && setTickets(tickets - 1);

  const renderVerticalPicker = (items, selected, setSelected, containerRef, formatItem, itemRefs) => (
    <Box
        ref={containerRef}
        sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 180,
        overflowY: 'auto',
        scrollSnapType: 'y mandatory',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
        alignItems: 'center',
        py: 1,
        width: '100%',
        boxSizing: 'border-box',
        }}
    >
        {items.map((item, i) => {
        const val = formatItem ? formatItem(item) : item;
        const isSelected = selected === val;
        return (
            <Box
            key={i}
            ref={(el) => itemRefs?.current && (itemRefs.current[i] = el)}
            onClick={() => setSelected(val)}
            sx={{
                scrollSnapAlign: 'center',
                py: 1.5,
                px: 4,
                borderRadius: 6,
                cursor: 'pointer',
                mb: 1,
                width: '90%',
                maxWidth: '400px',
                textAlign: 'center',
                fontWeight: isSelected ? 'bold' : 'medium',
                color: isSelected ? '#fff' : '#ddd',
                background: isSelected
                ? theme.palette.primary.main
                : 'rgba(255,255,255,0.05)',
                boxShadow: isSelected
                ? `0 4px 15px ${theme.palette.primary.main}33` // slight shadow using primary
                : 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                background: isSelected
                    ? theme.palette.primary.main
                    : 'rgba(255,255,255,0.1)',
                },
            }}
            >
            {val}
            </Box>
        );
        })}
    </Box>
    );

  useEffect(() => {
    const img = new Image();
    img.src = `https://image.tmdb.org/t/p/original${movie.poster_path}`;
    img.onload = () => setBgLoaded(true);
  }, [movie.poster_path]);

  if (!bgLoaded) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress size={60} color="primary" />
      </Box>
    );
  }

  return (
    <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.poster_path})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: '#fff',
    }}
  >
    {/* Dark overlay */}
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        bgcolor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(20px)',
      }}
    />

    <MovieBox movie={movie} />

    {/* Date + Time pickers */}
    <Box
      sx={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 2,
        zIndex: 2,
        minWidth: 300,
      }}
    >
      {renderVerticalPicker(dates, selectedDate, setSelectedDate, dateRef, formatDate, dateItemRefs)}
      {renderVerticalPicker(times, selectedTime, setSelectedTime, timeRef)}
    </Box>

    {/* Ticket picker */}
    <Box
      sx={{
        position: 'absolute',
        top: '55%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'rgba(255,255,255,0.05)',
        borderRadius: 8,
        px: 2,
        py: 1,
        width: 180,
        justifyContent: 'space-between',
        zIndex: 2,
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      }}
    >
      <Button
        onClick={decrementTickets}
        sx={{
          color: '#fff',
          minWidth: 40,
          fontWeight: 'bold',
          bgcolor: theme.palette.primary.main,
          borderRadius: '50%',
          '&:hover': { bgcolor: theme.palette.primary.dark },
        }}
      >
        -
      </Button>

      <Typography
        sx={{
          color: '#fff',
          fontSize: '1.4rem',
          fontWeight: 'bold',
          width: 40,
          textAlign: 'center',
        }}
      >
        {tickets}
      </Typography>

      <Button
        onClick={incrementTickets}
        sx={{
          color: '#fff',
          minWidth: 40,
          fontWeight: 'bold',
          bgcolor: theme.palette.primary.main,
          borderRadius: '50%',
          '&:hover': { bgcolor: theme.palette.primary.dark },
        }}
      >
        +
      </Button>
    </Box>

    {/* Bottom button */}
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0, 
        p: 2,
        // backgroundColor: "white",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ color: 'white'}}
        onClick={handleConfirmBooking}
        disabled={loading}
      >
        {loading ? (
          <CircularProgress
            size={24}
            sx={{ color: 'white' }}
          />
        ) : (
          'Confirm Booking'
        )}
      </Button>
    </Box>
  </Box>

  );
}
