const mongoose = require('mongoose');
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
});

module.exports = mongoose.model('User', userSchema);