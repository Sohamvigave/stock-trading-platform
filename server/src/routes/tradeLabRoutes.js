// server/src/routes/tradeLabRoutes.js

const router = require('express').Router();
const { getTradeLabMetrics } = require('../controllers/tradeLabController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getTradeLabMetrics);

module.exports = router;
