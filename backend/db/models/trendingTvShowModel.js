import mongoose from 'mongoose';

const trendingTvShowSchema = new mongoose.Schema({
    adult: { type: Boolean },
    backdrop_path: { type: String },
    id: { type: Number, required: true, unique: true },
    name: { type: String },
    original_language: { type: String },
    original_name: { type: String },
    overview: { type: String },
    poster_path: { type: String },
    media_type: { type: String },
    genre_ids: { type: [Number] },
    popularity: { type: Number },
    first_air_date: { type: String },
    vote_average: { type: Number },
    vote_count: { type: Number },
    origin_country: { type: [String] }
});

const trendingTvShow = mongoose.model('trendingTvShow', trendingTvShowSchema);

export default trendingTvShow;
