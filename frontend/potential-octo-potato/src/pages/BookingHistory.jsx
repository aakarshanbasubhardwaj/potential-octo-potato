import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function BookingHistory() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  const fetchTickets = async () => {
    try {
      const res = await fetch('http://localhost:3333/tickets/getAllTickets/');
      if (!res.ok) throw new Error('Failed to fetch tickets');
      const data = await res.json();

      // Sort by booking date (descending: newest first)
      const sortedTickets = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setTickets(sortedTickets);
    } catch (err) {
      console.error(err);
      alert('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };
  fetchTickets();
}, []);


    if (loading)
    return (
        <Box
        sx={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}
        >
        <CircularProgress />
        </Box>
    );

    if (tickets.length === 0)
    return (
        <Box
        sx={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}
        >
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
            No ticket history yet.
        </Typography>
        </Box>
    );


  return (
    <Box sx={{ p: 3 }}>
      {/* <Typography variant="overline" sx={{ mb: 3, textAlign: 'center' }}>
        Past Tickets
      </Typography> */}

      {tickets.map((ticket) => (
        <Card
          key={ticket.confirmationNumber}
          elevation={3}
          sx={{
            display: 'flex',
            cursor: 'pointer',
            borderRadius: 3,
            overflow: 'hidden',
            mb: 2,
            width: '100%', // full width
            '&:hover': { boxShadow: 8 },
          }}
          onClick={() => navigate(`/ticket/${ticket.confirmationNumber}`)}
        >
          {/* Movie Poster */}
          {ticket.poster_path && (
            <CardMedia
              component="img"
              sx={{ width: 120, objectFit: 'cover' }}
              image={`https://image.tmdb.org/t/p/original${ticket.poster_path}`}
              alt={ticket.title}
            />
          )}

          {/* Dotted separator */}
          <Box
            sx={{
              width: 8,
              borderRight: '2px dashed rgba(0,0,0,0.2)',
            }}
          />

          {/* Ticket Details */}
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              flex: 1,
              p: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {ticket.title}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">
                <strong>Date:</strong> {ticket.date}
              </Typography>
              <Typography variant="body2">
                <strong>Time:</strong> {ticket.time}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">
                <strong>Tickets:</strong> {ticket.tickets}
              </Typography>
              <Typography variant="body2">
                <strong>Conf #:</strong> {ticket.confirmationNumber}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
