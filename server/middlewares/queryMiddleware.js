// const Transaction = require("../models/transaction.model");
const BankAccount = require("../models/bankAccount.model");
const User = require("../models/user.model");
const findAndSortTx = require('../utils/txsResolver')
// const { Op } = require("sequelize");

// THIS MIDDLEWARE WAS GREAT BUT EVENTUALLY WE NEED TO CHANGE IT BECAUSE IT ONLY TAKES INTO ACCOUNT TXS 
// FROM THE USER AND NOT TXS RECEIVED BYH HIM

// FIRSTLY WE GONNA USE THE LASTTX MIDDLEWARE TO GET ALL THE TXS AND THEN WE WILL FILTER

exports.customQuery = async (req, res, next) => {
  let transactions = [];
  // let accounts;
  // let account;
  // let accounts = await BankAccount.findAll({
  //   where: {
  //     [Op.and]: [
  //       { UserId: req.user },
  //       {
  //         [Op.or]: [{ type: "checking" }, { type: "investments" }],
  //       },
  //     ],
  //   },
  // });

  // Filter by account

  const user = await User.findByPk(req.user);
  const accounts = await user.getBankAccounts();
  const accountCreationDate = accounts[0].createdAt;

  // needs to filter with req.user to only get bank from userID

  const queryObj = { ...req.query };
  if (queryObj.account === "all") {
    // accounts = await user.getBankAccounts();
    // accountCreationDate = accounts[0].createdAt;
    // for (const account of accounts) {
    //   const accountTxs = await account.getTransactions();
    //   for (const a of accountTxs) {
    //     transactions.push({
    //       id: a.id,
    //       type: a.type,
    //       amount: a.amount,
    //       createdAt: a.createdAt,
    //     });
    //   }

    transactions = await findAndSortTx(req.user, 'allTxs')
   
    // OK HERE
  
  }
  if (queryObj.account !== "all") {
    // account = await BankAccount.findOne({
    //   where: {
    //     type: queryObj.account,
    //   },
    // });
    // accountCreationDate = account.createdAt;
    // const accountTxs = await account.getTransactions();
    // for (const a of accountTxs) {
    //   transactions.push({
    //     id: a.id,
    //     type: a.type,
    //     amount: a.amount,
    //     createdAt: a.createdAt,
    //   });
  // }
    transactions = await findAndSortTx(req.user, 'allTxs', queryObj.account)
   
    // OK HERE
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

// const txs = await Transaction.findAll();
// const finalQuery = CustomQuery.filter(query, txs);

// const txs = await Transaction.findAndCountAll({
//   where: {
//     [Op.and]: [{ type: query.type }, { status: query.status }],
//   },
// });

// const queryArray = [
//   { account },
//   { type },
// { status },
// { amount },
// { order },
//   { startDate },
//   { endDate },
// ];

// queryArray.forEach(q => {
//   if (Object.values(q)[0]) {
//     const [key, value] = Object.entries(q)[0];
//     query[key] = value;
//   }
// });
