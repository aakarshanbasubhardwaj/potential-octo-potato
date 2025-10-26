import mongoose from 'mongoose';

const movieRuntimeCacheSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },  
    runtime: {type: String}
});

const movieRuntimeCache = mongoose.model('movieRuntimeCache', movieRuntimeCacheSchema);

export default movieRuntimeCache;
