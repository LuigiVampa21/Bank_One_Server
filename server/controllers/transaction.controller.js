const { Sequelize, Op } = require("sequelize");
const { StatusCodes } = require("http-status-codes");

const CustomError = require("../errors");
const CustomQuery = require("../utils/customQuery");
const Transaction = require("../models/transaction.model");
const BankAccount = require("../models/bankAccount.model");
const sendNewTransaction = require("../email/sendNewTransaction");
const crypto = require("crypto");

exports.getAllTx = async (req, res) => {
  // let query = [];
  let query = {};
  const {
    type,
    status,
    gtAmount,
    ltAmount,
    eqAmount,
    order,
    startDate,
    endDate,
  } = req.body;

  const queryArray = [
    { type },
    { status },
    { gtAmount },
    { ltAmount },
    { eqAmount },
    { order },
    { startDate },
    { endDate },
  ];

  queryArray.forEach(q => {
    if (Object.values(q)[0]) {
      const [key, value] = Object.entries(q)[0];
      query[key] = value;
    }
  });
  const txs = await Transaction.findAll();
  const finalQuery = CustomQuery.filter(query, txs);
  // const txs = await Transaction.findAndCountAll({
  //   where: {
  //     [Op.and]: [{ type: query.type }, { status: query.status }],
  //   },
  // });
  res.status(StatusCodes.OK).json({
    // data: {
    //   type: query.type,
    //   status: query.status,
    // },
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

  // commented for testing purposes think about to uncomment for production

  // if (amount > bankAccount.amount) {
  //   throw new CustomError.BadRequestError(
  //     "Insufficient funds. Please make a deposit to complete this transaction."
  //   );
  // }

  const user = await bankAccount.getUser();
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
    type,
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

exports.finalizeTx = async transaction => {
  const iban = transaction.beneficiary;
  const { BankAccountId: id } = transaction;
  const { amount } = transaction;

  const accountSending = await BankAccount.findByPk(id);
  const accountReceiving = await BankAccount.findOne({ where: { iban } });

  await accountSending.decrement("amount", {
    by: amount,
  });
  await accountReceiving.increment("amount", {
    by: amount,
  });
};
