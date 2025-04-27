// server/src/controllers/tradeController.js

const axios = require('axios');
const cheerio = require('cheerio');
const User = require('../models/User');

/**
 * Helper function to fetch the current stock price.
 * For a given ticker and exchange, returns the price as a number.
 */
async function fetchCurrentPrice(ticker, exchange) {
    try {
        const url = `https://www.google.com/finance/quote/${ticker}:${exchange}`;
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);
        const priceText = $('.YMlKec.fxKbKc').first().text().trim();
        // Remove commas and any currency symbols before converting to Number
        return Number(priceText.replace(/[^0-9.]/g, ''));
    } catch (error) {
        console.error('Error fetching current price:', error.message);
        throw new Error('Price fetch failed');
    }
}

/**
 * Handle a buy order.
 * Expected body: { ticker, exchange, quantity }
 */
const buyStock = async (req, res) => {
    try {
        const { ticker, exchange, quantity } = req.body;
        const userId = req.user.userId;
        const qty = Number(quantity);
        if (qty <= 0) return res.status(400).json({ error: 'Invalid quantity' });

        // Fetch current price (using your helper function)
        const currentPrice = await fetchCurrentPrice(ticker, exchange);
        if (!currentPrice) return res.status(500).json({ error: 'Unable to fetch price' });

        const cost = currentPrice * qty;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.balance < cost) return res.status(400).json({ error: 'Insufficient balance' });

        // Deduct cost from balance
        user.balance -= cost;

        // Update portfolio
        const existing = user.portfolio.find(item => item.symbol === ticker);
        if (existing) {
            const totalCost = existing.avgPrice * existing.quantity + cost;
            existing.quantity += qty;
            existing.avgPrice = totalCost / existing.quantity;
        } else {
            user.portfolio.push({ symbol: ticker, quantity: qty, avgPrice: currentPrice });
        }

        // Save the updated user
        await user.save();

        // Return the updated user data in the response
        res.json({ message: 'Stock purchased successfully', user });
    } catch (error) {
        console.error('Buy error:', error);
        res.status(500).json({ error: 'Buy order failed' });
    }
};


/**
 * Handle a sell order.
 * Expected body: { ticker, exchange, quantity }
 */
const sellStock = async (req, res) => {
    try {
        const { ticker, exchange, quantity } = req.body;
        const userId = req.user.userId;
        const qty = Number(quantity);
        if (qty <= 0) return res.status(400).json({ error: 'Invalid quantity' });

        // Fetch the current price using your helper (assume fetchCurrentPrice is defined)
        const currentPrice = await fetchCurrentPrice(ticker, exchange);
        if (!currentPrice) return res.status(500).json({ error: 'Unable to fetch price' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const existing = user.portfolio.find(item => item.symbol === ticker);
        if (!existing || existing.quantity < qty) {
            return res.status(400).json({ error: 'Not enough shares to sell' });
        }

        // Calculate revenue from sale
        const revenue = currentPrice * qty;

        // Update portfolio: subtract sold quantity
        existing.quantity -= qty;
        if (existing.quantity === 0) {
            // Remove stock from portfolio if quantity drops to zero
            user.portfolio = user.portfolio.filter(item => item.symbol !== ticker);
        }

        // Add revenue to user's balance
        user.balance += revenue;

        // Optionally, record trade history here.

        // Save the updated user and return updated data
        await user.save();
        res.json({ message: 'Stock sold successfully', user });
    } catch (error) {
        console.error('Sell error:', error);
        res.status(500).json({ error: 'Sell order failed' });
    }
};

module.exports = { buyStock, sellStock };


module.exports = {
    buyStock,
    sellStock,
};
