const { Sequelize, Op } = require("sequelize");
const { StatusCodes } = require("http-status-codes");

const CustomError = require("../errors");
const Transaction = require("../models/transaction.model");
const BankAccount = require("../models/bankAccount.model");
const sendNewTransaction = require("../email/sendNewTransaction");
const crypto = require("crypto");
const checkType = require('../utils/checkTXType')

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

    // Possible to check 2nd tyme is type === internal

  const isInternal = await checkType(user, beneficiary);

if(type === 'internal' && !isInternal){
  throw new CustomError.BadRequestError('Sorry wrong transaction type')
}

if(type === 'external' && isInternal){
  throw new CustomError.BadRequestError('Sorry wrong transaction type')
}

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
    // bankAccount,
    // transaction,
    typeTX
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

  if (!accountReceiving) {
    await accountSending.decrement("amount", {
      by: amount,
    });
    return;
  }

  await accountSending.decrement("amount", {
    by: amount,
  });
  await accountReceiving.increment("amount", {
    by: amount,
  });
};

exports.searchDocs = async (req, res) => {
  const { txs } = req;
  res.status(StatusCodes.OK).json({
    results: txs.length,
    txs,
  });
};

exports.createNewLoanTransaction = async (loan) => {

  const masterBA = await BankAccount.findOne({
    where: {
      [Op.and]: [
        { type: "Bank One Ltd." },
        { iban: "LI 0000 0000 0000 0000" }
      ],
    }
  })

  const account = await loan.getBankAccount()


  const transaction = await masterBA.createTransaction({
    amount: loan.amount,
    description: "Loan accorded from Bank One Ltd.",
    beneficiary: account.iban,
    type: "external",
    status: "settled",

  });

  return transaction;
}


