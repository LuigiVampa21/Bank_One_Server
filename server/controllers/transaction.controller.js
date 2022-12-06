const { Sequelize } = require("sequelize");
const { StatusCodes } = require("http-status-codes");

const Transaction = require("../models/transaction.model");
const BankAccount = require("../models/bankAccount.model");
const sendTransactionEmail = require("../email/sendTransaction");

exports.getAllTx = async (req, res) => {
  const txs = await Transaction.findAll();
  res.status(StatusCodes.OK).json({
    txs,
  });
};

exports.createNewTx = async (req, res) => {
  const { account, amount, description, type, beneficiary } = req.body;
  const bankAccount = await findByPk(account.id);
  //   bankAccount.add
  //   or newTx.set
};

exports.getSingleTx = async (req, res) => {
  const { id } = req.params;
  const tx = await Transaction.findByPk(id);
  res.status(StatusCodes.OK).json({
    tx,
  });
};
