const { Sequelize } = require("sequelize");
const User = require("../models/user.model");
const BankAccount = require('../models/bankAccount.model');
const { StatusCodes } = require('http-status-codes');
const lastTXFn = require('../utils/lastTx');
const getBeneficiary = require('../utils/txBeneficiary')

exports.getOverview = async(req,res) => {
  const user = await User.findByPk(req.user)
  const accounts = await user.getBankAccounts()
  const lastTransaction = await lastTXFn(accounts, 'lastTX')
  const beneficiaryName = await getBeneficiary(lastTransaction);
  // Can not add attribute on model after creation, will add to pass it as an argument, will try something ele later on
  lastTransaction.beneficiary_name = beneficiaryName;
  res.status(StatusCodes.OK).json({
      accounts,
      lastTransaction, 
      beneficiaryName
  })
}

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll({
    // include: [Address, ShoppingCart],
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
  await user.destroy();
  res.status(204).json({
    msg: null,
  });
};




