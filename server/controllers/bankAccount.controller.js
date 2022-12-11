const User = require('../models/user.model');
const BankAccount = require('../models/bankAccount.model');
const { StatusCodes } = require('http-status-codes');
const lastTXFn = require('../utils/lastTx')

exports.getBankAccounts = async(req,res) => {
    const user = await User.findByPk(req.user)
    const accounts = await user.getBankAccounts()
    const lastTransaction = await lastTXFn(accounts, 'lastTX')
    res.status(StatusCodes.OK).json({
        accounts,
        lastTransaction 
    })
}