const findAndSortTx = require('../utils/txsResolver');
const {StatusCodes} = require('http-status-codes');
const BankAccount = require('../models/bankAccount.model');

exports.getAllBankAccounts = async(req,res) => {
    const bank_accounts = await BankAccount.findAll();
    res.status(StatusCodes.OK).json({
        results: bank_accounts.length,
        data: bank_accounts
    })
}

exports.getTxsByAccount = async(req,res) => {
    let txs;
    const {type} = req.query;
    if(!type){
        txs = await findAndSortTx(req.user, 'allTxs')
    }else{
        txs = await findAndSortTx(req.user, 'allTxs', type)
    }
    res.status(StatusCodes.OK).json({
        results: txs.length,
        type,
        txs
    })
}