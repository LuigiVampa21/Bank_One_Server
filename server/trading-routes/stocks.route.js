const express = require('express');
const router = express.Router();
const stocksController = require('../trading-controllers/stocks.controller');
const update = require('../utils/setAssetUpdatingTimer')

router.route('/').post(stocksController.createStockAsset)

module.exports = router;

