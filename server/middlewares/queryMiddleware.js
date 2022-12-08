const Transaction = require("../models/transaction.model");
const BankAccount = require("../models/bankAccount.model");
const { Op } = require("sequelize");

// The userID will be passed with the auth Middleware

exports.customQuery = async (req, res, next) => {
  let transactions = [];
  let accounts;
  let account;
  let accountCreationDate;
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

  const queryObj = { ...req.query };
  if (queryObj.account === "all") {
    accounts = await BankAccount.findAll();
    accountCreationDate = accounts[0].createdAt;
    for (const account of accounts) {
      const accountTxs = await account.getTransactions();
      for (const a of accountTxs) {
        transactions.push({
          id: a.id,
          type: a.type,
          amount: a.amount,
          createdAt: a.createdAt,
        });
      }
    }
  }
  if (queryObj.account !== "all") {
    account = await BankAccount.findOne({
      where: {
        type: queryObj.account,
      },
    });
    accountCreationDate = account.createdAt;
    const accountTxs = await account.getTransactions();
    for (const a of accountTxs) {
      transactions.push({
        id: a.id,
        type: a.type,
        amount: a.amount,
        createdAt: a.createdAt,
      });
    }
  }

  // Filter by type
  if (queryObj.type !== "all") {
    // console.log(transactions);
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

  // transactions = {
  //   startDate: queryObj.startDate,
  //   endDate: queryObj.endDate,
  // };
  // console.log(transactions);

  // transactions = [...transactions].filter(t => {
  //   // console.log(new Date(t.createdAt).getTime() > queryObj.startDate);
  //   new Date(t.startDate).getTime() > queryObj.startDate;
  // });

  console.log(transactions);

  // transactions = [...transactions].forEach((t, i) => {
  //   if (new Date(t.startDate).getTime() < queryObj.startDate) {
  //     console.log("deleted");
  //   }
  // });

  console.log(transactions);
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
