const Transaction = require("../models/transaction.model");
const BankAccount = require("../models/bankAccount.model");

// The userID will be passed with the auth Middleware

exports.customQuery = async (req, res, next) => {
  const queryObj = { ...req.query };
  const userId = req.user;
  // const { account, type, status, amount, order, startDate, endDate } =
  //   req.query;
  // queryObj = { account, type, status, amount, order, startDate, endDate };

  if (queryObj.account !== "all") {
    const accounts = await BankAccount.findAll({where: {userId: }});
  }

  // const txs = await Transaction.findAll();
  // const finalQuery = CustomQuery.filter(query, txs);

  // const txs = await Transaction.findAndCountAll({
  //   where: {
  //     [Op.and]: [{ type: query.type }, { status: query.status }],
  //   },
  // });
  next();
};

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
