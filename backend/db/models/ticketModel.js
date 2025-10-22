import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  tickets: { type: Number, required: true },
  confirmationNumber: { type: String, required: true, unique: true },
  poster_path: { type: String },
  backdrop_path: { type: String },
  validated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const ticket = mongoose.model('Ticket', ticketSchema);

export default ticket;
