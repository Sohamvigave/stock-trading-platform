// server/index.js

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
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

// Mount Stock Data Routes (Step 4)
const stockDataRoutes = require('./src/routes/stockDataRoutes');
app.use('/api/stock-data', stockDataRoutes);

// Test Route
app.get('/', (req, res) => {
    res.send('Stock Trading Platform Backend');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
