const express = require("express");
const router = express.Router();
const bankAccountController = require('../controllers/bankAccount.controller');
const authMiddleware = require('../middlewares/authMiddleware')

// ADD MIDDLEWARE ROLE ADMIN
router.route('/').get(authMiddleware.checkToken, bankAccountController.getAllBankAccounts);
router.route('/txs').get(authMiddleware.checkToken, bankAccountController.getTxsByAccount);


module.exports = router