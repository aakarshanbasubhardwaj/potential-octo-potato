import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';

export default function BookingConfirmation() {
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

  if (loading) return <Typography sx={{ p: 2 }}>Loading...</Typography>;
  if (!ticket) return <Typography sx={{ p: 2 }}>Ticket not found</Typography>;

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2,
      }}
    >
      {/* QR Code Top Half */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <QRCodeSVG value={ticket.confirmationNumber} size={200} />
      </Box>

      {/* Ticket Details Bottom Half */}
      <Box sx={{ flex: 1, mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="h6">Movie ID: {ticket.movieId}</Typography>
        <Typography>Date: {ticket.date}</Typography>
        <Typography>Time: {ticket.time}</Typography>
        <Typography>Tickets: {ticket.tickets}</Typography>
        <Typography>Confirmation #: {ticket.confirmationNumber}</Typography>

        <Button variant="contained" fullWidth sx={{ mt: 2 }}>
          Send Ticket
        </Button>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => navigate('/', { replace: true })}
        >
          Go to Home
        </Button>
      </Box>
    </Box>
  );
}
