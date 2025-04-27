// server/src/routes/tradeRoutes.js

const router = require('express').Router();
const { buyStock, sellStock } = require('../controllers/tradeController');
const authMiddleware = require('../middleware/authMiddleware'); // Create or import your JWT verification middleware

// Protect these routes with authentication
router.post('/buy', authMiddleware, buyStock);
router.post('/sell', authMiddleware, sellStock);

module.exports = router;
