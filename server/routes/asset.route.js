const express = require('express');
const router = express.Router();

const assetController = require('../controllers/asset.controller')

router.route('/').get(assetController.getAllAssets)
router.route('/:id').get(assetController.getSingleAsset)

module.exports = router;