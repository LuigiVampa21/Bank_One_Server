const express = require('express');
const router = express.Router();
const stocksController = require('../trading-controllers/stocks.controller')

router.route('/').post(stocksController.createStockAsset)

module.exports = router;