import React from 'react';
import { Box, Typography, Divider, Button } from '@mui/material';
import { QRCodeSVG } from 'qrcode.react';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

export default function Ticket({ ticket }) {
  const { title, date, time, tickets, confirmationNumber, backdrop_path } = ticket;

  return (
    <div id="ticket-content">
    <Box
    id="ticket-content"
    sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minHeight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
      }}
    >
      {/* Movie Backdrop Full Width */}
      {backdrop_path && (
        <Box
          component="img"
          src={`https://image.tmdb.org/t/p/original${backdrop_path}`}
          alt="Movie Backdrop"
          sx={{
            width: '100%',
            height: { xs: '250px', sm: '320px' },
            objectFit: 'cover',
            boxShadow: 3,
          }}
        />
      )}

      <Typography variant="overline" sx={{ mt:2}}>
        <strong>{title}</strong>
      </Typography>

      {/* QR Code in White Box */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 1,
        }}
      >
        <Box
          sx={{
            bgcolor: 'white',
            p: 3,
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <QRCodeSVG value={confirmationNumber} size={250} fgColor="#000" />
        </Box>
      </Box>

      {/* Dotted Separator (like a ticket tear line) */}
      <Divider
        sx={{
          borderStyle: 'dashed',
          width: '100%',
          my: 3,
          borderColor: 'rgba(0,0,0,0.5)',
        }}
      />

      {/* Bottom Half: Ticket Details */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          width: '100%',
          pb: 4,
        }}
      >
        {/* Details */}
        <Box sx={{ width: '90%', maxWidth: 360 }}>
          {/* Date and Time on same line */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1">
              <strong>Date:</strong> {date}
            </Typography>
            <Typography variant="body1">
              <strong>Time:</strong> {time}
            </Typography>
          </Box>

          {/* Tickets and Confirmation # on same line */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body1">
              <strong>Tickets:</strong> {tickets}
            </Typography>
            <Typography variant="body1">
              <strong>Conf #:</strong> {confirmationNumber}
            </Typography>
          </Box>

          {/* Small message */}
          <Typography
            variant="caption"
            sx={{
              textAlign: 'center',
              opacity: 0.7,
              display: 'block',
              mt: 2,
            }}
          >
            Enjoy your show! 🍿🎬
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2, // space between buttons
            mt: 2
          }}
        >
        <Button
          variant="outlined"
          color="primary"
          startIcon={<DownloadRoundedIcon />}
          onClick={() => {
            window.open(`http://10.0.0.1:3333/tickets/ticket-pdf/${ticket.confirmationNumber}`, '_blank');
          }}
        >
          Download PDF
        </Button>
        </Box>
      </Box>
    </Box>
    </div>
  );
}
