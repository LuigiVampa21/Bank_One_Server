const User = require("../models/user.model");
const BankAccount = require("../models/bankAccount.model");
const CustomError = require('../errors')
const { StatusCodes } = require('http-status-codes');
const crypto = require('crypto')
const lastTXFn = require('../utils/txsResolver');
const getBeneficiary = require('../utils/txBeneficiary');
const sortingAccounts = require('../utils/sortingAccountConvention');
const getKnownAccounts = require('../utils/getKnownAccounts');
const sendDeleteUserAccount = require('../email/sendDeleteUserAccount');
const hashString = require('../utils/createHash')

exports.getOverview = async(req,res) => {
  // const user = await User.findByPk(req.user)
  const userID = req.user
  // const accounts = await user.getBankAccounts()
  let beneficiaryName;
  const {accounts, lastTx} = await lastTXFn(userID, 'lastTX');
  // console.log(lastTransaction);
  if(lastTx){
    beneficiaryName = await getBeneficiary(lastTx);
  }
  const knownAccounts = await getKnownAccounts(req.user)
  // Can not add attribute on model after creation, will add to pass it as an argument, will try something ele later on
  // lastTransaction.beneficiary_name = beneficiaryName;
  res.status(StatusCodes.OK).json({
      accounts,
      lastTx, 
      beneficiaryName,
      knownAccounts
  })
}

exports.getUserAccounts = async(req,res) => {
  const user = await User.findByPk(req.user)
  let accounts = await user.getBankAccounts();
  accounts = sortingAccounts(accounts)
  res.status(StatusCodes.OK).json({
    accounts
  })
} 

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll({
    include: [BankAccount],
  });
  res.status(200).json({
    results: users.length,
    users,
  });
};

exports.getSingleUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  res.status(200).json({
    user,
  });
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;
  const user = await User.findByPk(id);
    await user.update({
      firstName,
      lastName,
      email,
    });
    await user.save();
  res.status(200).json({
    user,
  });
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  if(!user) throw new CustomError.BadRequestError('No user found')
  if(!user.is_active) throw new CustomError.BadRequestError('You cannot close, your account yet, as it is a sleeping account 😴')
  // await user.destroy();
  const verificationToken = crypto.randomBytes(40).toString("hex");
  await user.update({
    verification_token: verificationToken
  })
  const hashedToken = hashString(verificationToken);
  await sendDeleteUserAccount(user, hashedToken)
  res.status(204).json({
    msg: null,
  });
};




