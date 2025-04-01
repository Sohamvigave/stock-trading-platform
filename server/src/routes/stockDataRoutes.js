// server/src/routes/stockDataRoutes.js

const router = require('express').Router();
const { getStockData } = require('../controllers/stockDataController');

// GET /api/stock-data?ticker=INFY&exchange=NSE
router.get('/', getStockData);

module.exports = router;
