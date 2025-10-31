import mongoose from 'mongoose';

const watchProviderCacheSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },  
    provider: {type: Array}
});

const watchProviderCache = mongoose.model('watchProviderCache', watchProviderCacheSchema);

export default watchProviderCache;
