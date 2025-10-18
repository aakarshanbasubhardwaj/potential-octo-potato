import mongoose from 'mongoose';

const movieGenresSchema = new mongoose.Schema({
    id: { type: Number },
    name: { type: String },
});

const movieGenres = mongoose.model('movieGenres', movieGenresSchema);

export default movieGenres;

