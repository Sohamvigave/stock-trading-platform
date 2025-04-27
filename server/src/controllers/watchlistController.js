const Watchlist = require('../models/Watchlist');

// GET /api/watchlists - fetch all watchlists for the logged-in user
const getUserWatchlists = async (req, res) => {
    try {
        const userId = req.user.userId;
        const watchlists = await Watchlist.find({ user: userId });
        res.json({ watchlists });
    } catch (error) {
        console.error('Error fetching watchlists:', error);
        res.status(500).json({ error: 'Error fetching watchlists' });
    }
};

// POST /api/watchlists - create a new watchlist
const createWatchlist = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });
        // Optionally check for duplicates:
        const existing = await Watchlist.findOne({ user: userId, name });
        if (existing) return res.status(400).json({ error: 'Watchlist with that name already exists' });
        const newWatchlist = new Watchlist({ user: userId, name, stocks: [] });
        await newWatchlist.save();
        res.json({ message: 'Watchlist created successfully', watchlist: newWatchlist });
    } catch (error) {
        console.error('Error creating watchlist:', error);
        res.status(500).json({ error: 'Error creating watchlist' });
    }
};

// PUT /api/watchlists/add-stock - add a stock to a watchlist
const addStockToWatchlist = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { watchlistId, stock } = req.body; // stock should contain { ticker, exchange, price }
        if (!watchlistId || !stock || !stock.ticker) {
            return res.status(400).json({ error: 'Invalid parameters' });
        }

        const watchlist = await Watchlist.findOne({ _id: watchlistId, user: userId });
        if (!watchlist) {
            return res.status(404).json({ error: 'Watchlist not found' });
        }

        // Prevent duplicate stocks
        if (watchlist.stocks.some(s => s.ticker === stock.ticker)) {
            return res.status(400).json({ error: 'Stock already in watchlist' });
        }

        // --- NEW CODE: Clean the price ---
        // Remove non-numeric characters (except the decimal point) from the price.
        const cleanPrice = Number(stock.price.replace(/[^0-9.]/g, ''));
        if (isNaN(cleanPrice)) {
            return res.status(400).json({ error: 'Invalid price format' });
        }
        // Replace the original price with the cleaned price.
        const cleanStock = { ...stock, price: cleanPrice };
        // --- END NEW CODE ---

        watchlist.stocks.push(cleanStock);
        await watchlist.save();
        res.json({ message: 'Stock added to watchlist', watchlist });
    } catch (error) {
        console.error('Error adding stock to watchlist:', error);
        res.status(500).json({ error: 'Error adding stock to watchlist' });
    }
};

const deleteWatchlist = async (req, res) => {
    try {
        const userId = req.user.userId;
        const watchlistId = req.params.id;

        // Find and delete the watchlist that belongs to the logged-in user
        const deleted = await Watchlist.findOneAndDelete({ _id: watchlistId, user: userId });
        if (!deleted) {
            return res.status(404).json({ error: 'Watchlist not found' });
        }

        res.json({ message: 'Watchlist deleted successfully', watchlist: deleted });
    } catch (error) {
        console.error("Error deleting watchlist:", error);
        res.status(500).json({ error: 'Error deleting watchlist' });
    }
};

module.exports = { getUserWatchlists, createWatchlist, addStockToWatchlist, deleteWatchlist };


