import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {API_BASE_URL} from '../config/config.js';
import { useNavigate } from 'react-router-dom';

export default function BookingHistory() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/tickets/getAllTickets/`);
        if (!res.ok) throw new Error('Failed to fetch tickets');
        const data = await res.json();

        const sortedTickets = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setTickets(sortedTickets);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading)
    return (
      <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );

  if (tickets.length === 0)
    return (
      <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body1" sx={{ textAlign: 'center' }}>
          No ticket history yet.
        </Typography>
      </Box>
    );

  const today = new Date().setHours(0, 0, 0, 0);

  const upcomingTickets = tickets.filter(
    (t) => new Date(t.date).setHours(0, 0, 0, 0) >= today
  );
  const pastTickets = tickets.filter(
    (t) => new Date(t.date).setHours(0, 0, 0, 0) < today
  );

  const renderTicketCard = (ticket) => (
    <Card
      key={ticket.confirmationNumber}
      elevation={3}
      sx={{ display: 'flex', cursor: 'pointer', borderRadius: 3, overflow: 'hidden', mb: 2, width: '100%', '&:hover': { boxShadow: 8 } }}
      onClick={() => navigate(`/ticket/${ticket.confirmationNumber}`)}
    >
      {ticket.poster_path && (
        <CardMedia
          component="img"
          sx={{ width: 120, objectFit: 'cover' }}
          image={`https://image.tmdb.org/t/p/original${ticket.poster_path}`}
          alt={ticket.title}
        />
      )}

      <Box sx={{ width: 8, borderRight: '2px dashed rgba(0,0,0,0.2)' }} />

      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {ticket.title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2"><strong>Date:</strong> {ticket.date}</Typography>
          <Typography variant="body2"><strong>Time:</strong> {ticket.time}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2"><strong>Tickets:</strong> {ticket.tickets}</Typography>
          <Typography variant="body2"><strong>Conf #:</strong> {ticket.confirmationNumber}</Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 2 }}>
      {/* Always visible upcoming/current tickets */}
      {upcomingTickets.length > 0
        ? upcomingTickets.map(renderTicketCard)
        : <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Typography>No upcoming tickets.</Typography>
          </Box>
      }

      {/* Collapsible past tickets */}
      {pastTickets.length > 0 && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="caption">Previous Tickets</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {pastTickets.map(renderTicketCard)}
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
}
