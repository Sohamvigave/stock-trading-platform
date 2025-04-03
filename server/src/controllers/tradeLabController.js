const axios = require('axios');
const cheerio = require('cheerio');
const User = require('../models/User');

// Helper function: Fetch the current price for a given ticker (assumed to be on NSE)
const fetchCurrentPrice = async (ticker) => {
    try {
        const url = `https://www.google.com/finance/quote/${ticker}:NSE`;
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);
        // The selector below may need updating if Google changes its markup.
        const priceText = $('.YMlKec.fxKbKc').first().text().trim();
        const price = Number(priceText.replace(/[^0-9.]/g, ''));
        return price;
    } catch (error) {
        console.error(`Error fetching current price for ${ticker}:`, error.message);
        return 0;
    }
};

const getTradeLabMetrics = async (req, res) => {
    try {
        // Get the logged-in user's ID from the auth middleware (assumes req.user.userId is set)
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Calculate current value and invested margin of the portfolio
        const portfolio = user.portfolio || [];

        // Fetch current price for all stocks in parallel
        const stockDataPromises = portfolio.map(async (stock) => {
            const currentPrice = await fetchCurrentPrice(stock.symbol);
            return {
                symbol: stock.symbol,
                quantity: stock.quantity,
                avgPrice: stock.avgPrice,
                currentPrice
            };
        });
        const stocksWithPrices = await Promise.all(stockDataPromises);

        // Calculate totals
        let totalInvested = 0; // Invested margin: sum of (avgPrice * quantity)
        let currentValue = 0;  // Current market value: sum of (currentPrice * quantity)

        stocksWithPrices.forEach((stock) => {
            totalInvested += stock.avgPrice * stock.quantity;
            currentValue += stock.currentPrice * stock.quantity;
        });

        // Unrealized P&L: difference between current market value and invested margin
        const unrealizedPnL = currentValue - totalInvested;
        // Total Portfolio: current cash balance + current value of holdings
        const totalPortfolio = user.balance + currentValue;
        // Available Margin: for this example, assume it equals the user's cash balance
        const availableMargin = user.balance;

        const metrics = {
            totalPortfolio,
            unrealizedPnL,
            availableMargin,
            investedMargin: totalInvested
        };

        res.json(metrics);
    } catch (error) {
        console.error('Error in getTradeLabMetrics:', error.message);
        res.status(500).json({ error: 'Error fetching trade lab metrics.' });
    }
};

module.exports = { getTradeLabMetrics };
