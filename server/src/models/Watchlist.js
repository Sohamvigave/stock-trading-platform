const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    stocks: [
        {
            ticker: { type: String, required: true },
            exchange: { type: String, default: 'NSE' },
            price: { type: Number } // optional; can be updated dynamically
        }
    ]
});

module.exports = mongoose.model('Watchlist', watchlistSchema);
