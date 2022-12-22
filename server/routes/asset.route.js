const express = require('express');
const router = express.Router();

const assetController = require('../controllers/asset.controller');
const authMiddleware = require('../middlewares/authMiddleware')

router.route('/').get(authMiddleware.checkToken, assetController.getAllAssets)
router.route('/:id').get(authMiddleware.checkToken, assetController.getSingleAsset)

module.exports = router;