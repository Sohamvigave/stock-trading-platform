const router = require('express').Router();
const { buyStock, sellStock } = require('../controllers/tradeController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the middleware

// Secure trade routes
router.post('/buy', authMiddleware, buyStock);
router.post('/sell', authMiddleware, sellStock);

module.exports = router;
