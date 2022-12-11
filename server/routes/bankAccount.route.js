const express = require("express");
const router = express.Router();
const bankAccountController = require('../controllers/bankAccount.controller');
const authMiddleware = require('../middlewares/authMiddleware')

const BankAccount = require("../models/bankAccount.model");

router.route('/overview').get(authMiddleware.checkToken,bankAccountController.getBankAccounts)

module.exports = router