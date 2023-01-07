const { Op } = require("sequelize");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

const CustomError = require("../errors");
// const User = require("../models/user.model");
const BankAccount = require("../models/bankAccount.model");
const Transaction = require("../models/transaction.model");
const sendNewTransaction = require("../email/sendNewTransaction");
const checkType = require('../utils/checkTXType');
const findAndSortTx = require('../utils/txsResolver');
const getBeneficiary = require("../utils/txBeneficiary");
const {addToSenderKnownAccounts, addToReceiverKnownAccounts} = require('../utils/addToKnownAccounts');

exports.getAllTx = async (req, res) => {
  const txs = await Transaction.findAll();
  res.status(StatusCodes.OK).json({
    txs,
  });
};

exports.createNewTx = async (req, res) => {
  const { accountSending: account, amount, description, intext: type, accountReceiving: beneficiary } = req.body;
  // if (!account || !amount || !description || !type || !beneficiary) {
  if (!account || !amount || !type || !beneficiary) {
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

  const beneficiary_name = await getBeneficiary(transaction);
  await transaction.update({beneficiary_name})
  await transaction.save()

  await sendNewTransaction({
    name: user.first_name,
    transaction: transaction.id,
    amount,
    email: user.email,
    verificationToken: transaction.verification_token,
    beneficiary,
  });
  if(type === 'external'){
    await addToSenderKnownAccounts(user, beneficiary)
  }
  
  await transaction.setBankAccount(bankAccount);

  res.status(StatusCodes.OK).json({
    bankAccount,
    transaction,
  });
};

exports.getSingleTx = async (req, res) => {
  const { id } = req.params;
  const tx = await Transaction.findByPk(id);
  // console.log(tx.beneficiary_name);
  const name = tx.beneficiary_name;
  res.status(StatusCodes.OK).json({
    name
  });
};

exports.finalizeTx = async (transaction, loan = false) => {
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
  if(loan) return;
    await addToReceiverKnownAccounts(accountSending, accountReceiving)
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
    description: "Loan approved from Bank One Ltd.",
    beneficiary: account.iban,
    type: "external",
    status: "settled",

  });

  console.log(transaction.toJSON());

  return transaction;
}

exports.getAllUserTxs = async(req,res) =>{
  // let userIBANs = [];
  // let txFromUser = [];
  // let txToUser = [];
  // const user = await User.findByPk(req.user)
  // const accounts = await user.getBankAccounts(); 
  // for (const account of accounts){
  //   userIBANs = [...userIBANs, account.iban];
  //   const txFromAccount = await account.getTransactions();
  //   txFromUser = [... txFromUser, ...txFromAccount];
  // }
  // // const txFromUser = await user
  // // Searching into All DB Txs does not seems really scalable as the application grows, we'll need to change the model 
  // // of as many to many and set an association table with a user sending and a user receiving

  // for (const iban of userIBANs){
  //   txToIban = await Transaction.findAll({where: {beneficiary: iban}});
  //   txToUser = [...txToUser, ...txToIban]
  // }

  // txToUser.forEach(tx => tx.inflow = true)
  // // We will add the in property on all txs To accounts to be able to add a sign (+ or -) in the front part of our app, but we won't save it on the model.
  // // So next time someone will ask for this txs he'll be able to set or not the in attribute depends is he is sender or receiver

  // const allTxs = [...txFromUser, ...txToUser];
  // allTxs.sort((a,b) => {
  //   return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  // }, 0)

  const userID = req.user;

  const allTxs = await findAndSortTx(userID, 'allTxs')

  res.status(StatusCodes.OK).json({
    // userIBANs,
    allTxs
  })
}
