import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  id: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  tickets: { type: Number, required: true },
  confirmationNumber: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const ticket = mongoose.model('Ticket', ticketSchema);

export default ticket;
