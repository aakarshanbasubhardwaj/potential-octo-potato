import mongoose from 'mongoose';

const searchResltSchema = new mongoose.Schema({
  adult: { type: Boolean, default: true },
  backdrop_path: { type: String },
  id: { type: Number, required: true, unique: true, default: 0 },
  title: { type: String },
  original_language: { type: String },
  original_title: { type: String },
  overview: { type: String },
  poster_path: { type: String },
  media_type: { type: String },
  genre_ids: { type: [Number] },
  popularity: { type: Number, default: 0 },
  release_date: { type: String },
  video: { type: Boolean, default: true },
  vote_average: { type: Number, default: 0 },
  vote_count: { type: Number, default: 0 },
  total_pages: { type: Number, default: 0 }
});

const searchResult = mongoose.model('searchResult', searchResltSchema);

export default searchResult;
