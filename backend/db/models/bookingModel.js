import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  id: { type: Number, required: true }, 
  type: {type: String, required: true},
  title: { type: String, required: true },
  date: { type: String, required: true },   
  time: { type: String, required: true },  
  runtime: { type: Number, required: true },
  tickets: { type: Number, default: 2 },
  poster_path: String,
  backdrop_path: String,
  createdAt: { type: Date, default: Date.now },
});

const booking = mongoose.model('booking', bookingSchema);

export default booking;
