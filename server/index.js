// server/index.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http'); // Create HTTP server
const socketIo = require('socket.io'); // Import Socket.IO
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Mount Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const stockDataRoutes = require('./src/routes/stockDataRoutes');
app.use('/api/stock-data', stockDataRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Stock Trading Platform Backend');
});

// Create an HTTP server and integrate Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*" }  // Adjust the CORS settings as needed for your production environment
});

// Function to fetch stock data using Google Finance
async function fetchStockData(ticker = 'INFY', exchange = 'NSE') {
    try {
        const url = `https://www.google.com/finance/quote/${ticker}:${exchange}`;
        const { data: html } = await axios.get(url);
        const $ = cheerio.load(html);
        // Note: This selector might change if Google updates its page structure.
        const price = $('.YMlKec.fxKbKc').text().trim();
        return { ticker, exchange, price: price || 'Data not available' };
    } catch (error) {
        console.error('Error fetching stock data for Socket.IO:', error.message);
        return { ticker, exchange, price: 'Error' };
    }
}

// Socket.IO connection and periodic data emission
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Immediately fetch and send current stock data
    (async () => {
        const data = await fetchStockData();
        socket.emit('stockDataUpdate', data);
    })();

    // Set up an interval to fetch and emit data every 15 seconds
    const interval = setInterval(async () => {
        const data = await fetchStockData();
        socket.emit('stockDataUpdate', data);
    }, 15000);

    // Handle client disconnect
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        clearInterval(interval);
    });
});

// Start the server with Socket.IO enabled
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
