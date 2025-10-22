import mongoose from 'mongoose';

const cacheSchema = new mongoose.Schema({
  model: { type: String, required: true, unique: true },
  lastFetched: { type: Date, required: true }
});

const cache = mongoose.model('cache', cacheSchema);

export default cache;
