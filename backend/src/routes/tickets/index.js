import express from 'express';
import Ticket from '../../../db/models/ticketModel.js';
import crypto from 'crypto';
import db from '../../../db/methods/dbOperations.js';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';

const router = express.Router();

router.post('/createTicket', async (req, res) => {
  try {
    const { title, date, time, tickets, poster_path, backdrop_path } = req.body;

    if (!title || !date || !time || !tickets) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate unique confirmation number
    const confirmationNumber = crypto.randomBytes(4).toString('hex').toUpperCase();

    const ticketData = {
      title,
      date,
      time,
      tickets,
      confirmationNumber,
      poster_path,
      backdrop_path
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

router.get('/getAllTickets', async (req, res) => {
  try {

    const ticket = await db.getAll(Ticket);

    if (!ticket) return res.status(404).json({ error: 'No tickets not found' });

    return res.json(ticket);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/tmdb-image', async (req, res) => {
  const { path } = req.query;
  const response = await fetch(`https://image.tmdb.org/t/p/original${path}`);
  const buffer = await response.arrayBuffer();
  res.set('Content-Type', 'image/jpeg');
  res.set('Access-Control-Allow-Origin', '*');
  res.send(Buffer.from(buffer));
});


router.get('/ticket-pdf/:confirmationNumber', async (req, res) => {
  const ticketId = req.params.confirmationNumber;

  // Fetch ticket details from DB
  const ticket = await db.getOne(Ticket, { confirmationNumber: ticketId });
  if (!ticket) return res.status(404).send('Ticket not found');

  const { title, date, time, tickets, confirmationNumber, backdrop_path } = ticket;

  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=${title}-ticket.pdf`);

  const doc = new PDFDocument({
    size: [350, 555],
    margin: 20
  });

  // Pipe PDF directly to response
  doc.pipe(res);

  let currentY = 0;
  const leftX = 20;
  const rightX = 200;

  // Draw backdrop if available
  if (backdrop_path) {
    const imageRes = await fetch(`https://image.tmdb.org/t/p/original${backdrop_path}`);
    const imgBuffer = Buffer.from(await imageRes.arrayBuffer());
    doc.image(imgBuffer, 0, currentY, { width: 360, height: 180, align: 'center' });
    currentY += 180 + 30;
  }

  // Draw title
  doc.fontSize(14).text(title, 0, currentY, { align: 'center', width: 360 });
  currentY += 15;

  // Draw QR code bigger
  const qrDataURL = await QRCode.toDataURL(confirmationNumber, { width: 250 });
  doc.image(qrDataURL, 50, currentY, { width: 250, height: 250 }); // centered
  currentY += 250;

  // Draw details side by side
  // doc.fontSize(12);
  // doc.text(`Date: ${date}`, 20, currentY);
  // doc.text(`Time: ${time}`, 200, currentY);
  // currentY += 20;

  // doc.text(`Tickets: ${tickets}`, 20, currentY);
  // doc.text(`Conf #: ${confirmationNumber}`, 200, currentY);
  // currentY += 30;

  doc.save(); // save current state
  doc.moveTo(0, currentY)               // start point (left margin, currentY)
    .lineTo(360, currentY)              // end point (right margin, currentY)
    .dash(5, { space: 2 })              // 5px dash, 5px space
    .strokeColor('rgba(0,0,0,0.5)')             // line color
    .stroke();                          // draw the line
  doc.undash(); // remove dash effect for future lines
  doc.restore(); // restore previous state

  currentY += 20;

  // Date and Time
  doc.font('Helvetica-Bold').text('Date:', leftX, currentY);
  doc.font('Helvetica').text(date, leftX + 40, currentY); // value

  doc.font('Helvetica-Bold').text('Time:', rightX, currentY);
  doc.font('Helvetica').text(time, rightX + 40, currentY);

  currentY += 20;

  // Tickets and Conf #
  doc.font('Helvetica-Bold').text('Tickets:', leftX, currentY);
  doc.font('Helvetica').text(tickets, leftX + 55, currentY);

  doc.font('Helvetica-Bold').text('Conf #:', rightX, currentY);
  doc.font('Helvetica').text(confirmationNumber, rightX + 50, currentY);

  // currentY += 10;

  doc.end();
});

export default router;
