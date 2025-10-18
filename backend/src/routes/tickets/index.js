import express from 'express';
import Ticket from '../../../db/models/ticketModel.js';
import crypto from 'crypto';
import db from '../../../db/methods/dbOperations.js';

const router = express.Router();

router.post('/createTicket', async (req, res) => {
  try {
    const { movieId, date, time, tickets } = req.body;

    if (!movieId || !date || !time || !tickets) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate unique confirmation number
    const confirmationNumber = crypto.randomBytes(4).toString('hex').toUpperCase();

    const ticketData = {
      id: movieId,
      date,
      time,
      tickets,
      confirmationNumber,
    };

    await db.insertOne(Ticket, ticketData);

    return res.status(201).json({ confirmationNumber });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/getTicket/:confirmationNumber', async (req, res) => {
  try {
    const { confirmationNumber } = req.params;

    const ticket = await db.getOne(Ticket, { confirmationNumber });

    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    return res.json(ticket);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
