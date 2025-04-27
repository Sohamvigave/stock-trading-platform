const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ['buy', 'sell'], required: true },
    date: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 100000 }, // Starting balance for paper trading
    portfolio: [{
        symbol: String,
        quantity: Number,
        avgPrice: Number,
    }],
    trades: [tradeSchema],
});

// Check if the model already exists, if so, use it, otherwise compile a new model
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
