const router = require('express').Router();
const { getUserWatchlists, createWatchlist, addStockToWatchlist, deleteWatchlist } = require('../controllers/watchlistController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getUserWatchlists);
router.post('/', authMiddleware, createWatchlist);
router.put('/add-stock', authMiddleware, addStockToWatchlist);
router.delete('/:id', authMiddleware, deleteWatchlist);

module.exports = router;
