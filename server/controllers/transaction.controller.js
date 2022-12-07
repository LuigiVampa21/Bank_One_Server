const { Sequelize } = require("sequelize");
const { StatusCodes } = require("http-status-codes");

const CustomError = require("../errors");
const Transaction = require("../models/transaction.model");
const BankAccount = require("../models/bankAccount.model");
const sendNewTransaction = require("../email/sendNewTransaction");
const crypto = require("crypto");

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
  const bankAccount = await BankAccount.findByPk(account);
  if (!bankAccount) {
    throw new CustomError.BadRequestError(
      "No account found with the information you provided"
    );
  }

  const user = await bankAccount.getUser();
  // console.log(user.email);
  if (!user) {
    throw new CustomError.BadRequestError(
      "No account found with the information you provided"
    );
  }
  const txToken = crypto.randomBytes(70).toString("hex");

  const transaction = await Transaction.create({
    amount,
    description,
    beneficiary,
    verification_token: txToken,
  });
  if (!transaction) {
    throw new CustomError.BadRequestError(
      "Oops, something went wrong, please try again later!"
    );
  }
  transaction.verification_token = txToken;
  await sendNewTransaction({
    name: user.first_name,
    transaction: transaction.id,
    amount,
    email: user.email,
    verificationToken: transaction.verification_token,
    beneficiary,
  });
  await transaction.setBankAccount(bankAccount);
  res.status(StatusCodes.OK).json({
    bankAccount,
    transaction,
  });
};

exports.getSingleTx = async (req, res) => {
  const { id } = req.params;
  const tx = await Transaction.findByPk(id);
  res.status(StatusCodes.OK).json({
    tx,
  });
};
