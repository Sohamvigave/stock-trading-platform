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
async function buyStock(req, res) {
    try {
        const { ticker, exchange, quantity } = req.body;
        const userId = req.user.userId; // Assume authentication middleware sets req.user
        const qty = Number(quantity);

        if (qty <= 0) return res.status(400).json({ error: 'Invalid quantity' });

        // Get current price
        const currentPrice = await fetchCurrentPrice(ticker, exchange);
        if (!currentPrice) return res.status(500).json({ error: 'Unable to fetch stock price' });

        // Calculate total cost
        const cost = currentPrice * qty;

        // Get user from DB
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Check if the user has sufficient balance
        if (user.balance < cost) return res.status(400).json({ error: 'Insufficient balance' });

        // Deduct cost from user's balance
        user.balance -= cost;

        // Update portfolio: if stock exists, update quantity and average price; otherwise, add new entry.
        const existingStock = user.portfolio.find(item => item.symbol === ticker);
        if (existingStock) {
            // Calculate new average price
            const totalQuantity = existingStock.quantity + qty;
            existingStock.avgPrice = ((existingStock.avgPrice * existingStock.quantity) + cost) / totalQuantity;
            existingStock.quantity = totalQuantity;
        } else {
            user.portfolio.push({ symbol: ticker, quantity: qty, avgPrice: currentPrice });
        }

        // Optionally, record the trade history
        user.trades.push({ symbol: ticker, quantity: qty, price: currentPrice, type: 'buy' });

        await user.save();
        res.json({ message: 'Stock purchased successfully', portfolio: user.portfolio, balance: user.balance });
    } catch (error) {
        console.error('Buy order error:', error.message);
        res.status(500).json({ error: 'Buy order failed' });
    }
}

/**
 * Handle a sell order.
 * Expected body: { ticker, exchange, quantity }
 */
async function sellStock(req, res) {
    try {
        const { ticker, exchange, quantity } = req.body;
        const userId = req.user.userId; // Assume authentication middleware sets req.user
        const qty = Number(quantity);

        if (qty <= 0) return res.status(400).json({ error: 'Invalid quantity' });

        // Get current price
        const currentPrice = await fetchCurrentPrice(ticker, exchange);
        if (!currentPrice) return res.status(500).json({ error: 'Unable to fetch stock price' });

        // Get user from DB
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Find the stock in the user's portfolio
        const existingStock = user.portfolio.find(item => item.symbol === ticker);
        if (!existingStock || existingStock.quantity < qty) {
            return res.status(400).json({ error: 'Not enough shares to sell' });
        }

        // Update portfolio: reduce quantity
        existingStock.quantity -= qty;
        // Remove the stock if quantity becomes zero
        if (existingStock.quantity === 0) {
            user.portfolio = user.portfolio.filter(item => item.symbol !== ticker);
        }

        // Increase user's balance by sale amount
        const revenue = currentPrice * qty;
        user.balance += revenue;

        // Optionally, record the trade history
        user.trades.push({ symbol: ticker, quantity: qty, price: currentPrice, type: 'sell' });

        await user.save();
        res.json({ message: 'Stock sold successfully', portfolio: user.portfolio, balance: user.balance });
    } catch (error) {
        console.error('Sell order error:', error.message);
        res.status(500).json({ error: 'Sell order failed' });
    }
}

module.exports = {
    buyStock,
    sellStock,
};
