import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Button } from '@mui/material';
import Ticket from '../components/Ticket.jsx'
import { CircularProgress } from '@mui/material';


export default function Tickets() {
  const { confirmationNumber } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch ticket details
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`http://localhost:3333/tickets/getTicket/${confirmationNumber}`);
        if (!res.ok) throw new Error('Ticket not found');
        const data = await res.json();
        setTicket(data);
      } catch (err) {
        console.error(err);
        alert('Failed to load ticket');
        navigate('/', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [confirmationNumber, navigate]);

  // Prevent going back to previous pages
  useEffect(() => {
    // push current page into history
    window.history.pushState(null, '', window.location.href);

    const onPopState = () => {
      navigate('/', { replace: true });
    };

    window.addEventListener('popstate', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
    };
  }, [navigate]);

  if (loading)   return (
    <Box
      sx={{
        height: '100vh',        // full viewport height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  );
  if (!ticket) return <Typography sx={{ p: 2 }}>Ticket not found</Typography>;

  return (
    <Ticket ticket={ticket} />    
  );
}
