import mongoose from 'mongoose';

const tvGenresSchema = new mongoose.Schema({
    id: { type: Number },
    name: { type: String },
});

const tvGenres = mongoose.model('tvGenres', tvGenresSchema);

export default tvGenres;

