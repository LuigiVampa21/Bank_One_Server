const express = require('express');
const router = express.Router();
const commodittiesForexController = require('../trading-controllers/commodittiesForex.controller')

router.route('/').post(commodittiesForexController.createAsset)

module.exports = router;