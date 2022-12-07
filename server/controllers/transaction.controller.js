const { Sequelize } = require("sequelize");
const { StatusCodes } = require("http-status-codes");

const CustomError = require("../errors");
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
  if (!account || !amount || !description || !type || !beneficiary) {
    throw new CustomError.BadRequestError(
      "Cannot validate your transaction, missing informations"
    );
  }
  const bankAccount = await findByPk(account.id);
  if (!bankAccount) {
    throw new CustomError.BadRequestError(
      "No account found with the information you provided"
    );
  }
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
