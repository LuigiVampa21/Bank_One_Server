const BankAccount = require("../models/bankAccount.model");
const User = require("../models/user.model");
const findAndSortTx = require('../utils/txsResolver')

exports.customQuery = async (req, res, next) => {
  let transactions = [];

  const user = await User.findByPk(req.user);
  const accounts = await user.getBankAccounts();
  const accountCreationDate = accounts[0].createdAt;

  const queryObj = { ...req.query };
  if (queryObj.account === "all") {
    transactions = await findAndSortTx(req.user, 'allTxs')
  }
  if (queryObj.account !== "all") {
    transactions = await findAndSortTx(req.user, 'allTxs', queryObj.account)
  }

  // Filter by type
  if (queryObj.type !== "all") {
    transactions = [...transactions].filter(t => t.type == queryObj.type);
  }

  // Filter by amount
  if (queryObj.amount) {
    transactions = [...transactions].filter(t => +t.amount == +queryObj.amount);
  }

  // Filter by date
  if (!queryObj.startDate) {
    queryObj.startDate = new Date(accountCreationDate).getTime();
  }
  if (!queryObj.endDate) {
    queryObj.endDate = Date.now();
  }
  queryObj.startDate = new Date(queryObj.startDate).getTime();
  queryObj.endDate = new Date(queryObj.endDate).getTime();

  transactions = [...transactions].filter(t => {
    if (
      new Date(t.createdAt).getTime() > queryObj.startDate &&
      new Date(t.createdAt).getTime() < queryObj.endDate
    )
      return true;
    else return false;
  });

  req.txs = [...transactions];
  next();
};
