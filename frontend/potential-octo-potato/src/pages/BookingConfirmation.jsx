import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Button, Dialog, DialogContent, DialogTitle, IconButton , CircularProgress} from '@mui/material';
import Ticket from '../components/Ticket.jsx'
import CloseIcon from '@mui/icons-material/Close';
import {API_BASE_URL} from '../config/config.js';


export default function BookingConfirmation() {
  const { confirmationNumber } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/tickets/getTicket/${confirmationNumber}`);
        if (!res.ok) throw new Error('Ticket not found');
        const data = await res.json();
        setTicket(data);
      } catch (err) {
        console.error(err);
        setErrorMessage('Failed to load ticket: ' + (err.message || 'Unknown Error'));
        setErrorDialogOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [confirmationNumber]);

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const onPopState = () => navigate('/', { replace: true });
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [navigate]);

  if (loading)
    return (
      <Box
        sx={{
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        <CircularProgress color="primary" />
        {/* <Typography variant="overline" sx={{ mt: 2 }}>
          Loading your ticket...
        </Typography> */}
      </Box>
    );

  if (!ticket)
    return (
      <Box
        sx={{
          height: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'error.main',
          px: 2,
        }}
      >
        <Typography variant="h3" sx={{ mb: 1 }}>
          <CloseIcon />
        </Typography>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Ticket not found
        </Typography>
        <Typography variant="body1">
          The confirmation number {confirmationNumber} might be invalid, or the ticket could not be loaded.
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          sx={{ mt: 3 }}
          onClick={() => navigate('/')}
        >
          Go Home
        </Button>
      </Box>
    );


  return (
    <>
      {errorDialogOpen && (
        <Dialog
          open={errorDialogOpen}
          // onClose={() => setErrorDialogOpen(false)}
          onClose={() => {}}  
          disableEscapeKeyDown
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle
            sx={{
              bgcolor: 'error.main',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              pr: 1,
            }}
          >
            <Typography variant="h6">Error</Typography>
            {/* <IconButton
              edge="end"
              color="inherit"
              onClick={() => setErrorDialogOpen(false)}
              size="small"
            >
              <CloseIcon />
            </IconButton> */}
          </DialogTitle>
          <DialogContent dividers sx={{ bgcolor: 'background.paper' }}>
            <Typography variant="body1" color="textPrimary">
              {errorMessage}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setErrorDialogOpen(false);
                  navigate('/', { replace: true });
                }}
              >
                Go Home
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      )}
      <Ticket ticket={ticket} />
    </>
  );
}
