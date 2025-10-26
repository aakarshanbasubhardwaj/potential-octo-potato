import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Ticket from '../components/Ticket.jsx';

export default function Tickets() {
  const { confirmationNumber } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch ticket details
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`http://10.0.0.1:3333/tickets/getTicket/${confirmationNumber}`);
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

  // Prevent going back
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
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <>
      {errorDialogOpen && (
        <Dialog
          open={errorDialogOpen}
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
              justifyContent: 'space-between',
              alignItems: 'center',
              pr: 1,
            }}
          >
            <Typography variant="h6">Error</Typography>
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

      {ticket && <Ticket ticket={ticket} />}
    </>
  );
}
