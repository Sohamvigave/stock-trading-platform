// server/src/controllers/stockDataController.js

const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Fetches the real-time stock data from Google Finance.
 * Accepts query parameters "ticker" and "exchange".
 */
async function getStockData(req, res) {
    try {
        // Get ticker and exchange from query params, defaulting to INFY and NSE if not provided
        const ticker = req.query.ticker || 'INFY';
        const exchange = req.query.exchange || 'NSE';
        const url = `https://www.google.com/finance/quote/${ticker}:${exchange}`;

        // Fetch the HTML page from Google Finance
        const { data: html } = await axios.get(url);

        // Load the HTML into Cheerio for parsing
        const $ = cheerio.load(html);

        // **IMPORTANT:** The selector below targets the stock price element.
        // This may change in the future if Google updates their page structure.
        const priceElement = $('.YMlKec.fxKbKc');
        const price = priceElement.text().trim();

        // Respond with JSON containing the ticker, exchange, and price
        res.json({
            ticker,
            exchange,
            price: price || 'Data not available'
        });
    } catch (error) {
        console.error('Error fetching stock data:', error.message);
        res.status(500).json({ error: 'Unable to fetch stock data' });
    }
}

module.exports = {
    getStockData
};
