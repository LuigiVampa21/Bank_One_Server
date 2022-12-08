exports.customQuery = (req, res, next) => {
  let queryObj = {};
  const { account, type, status, amount, order, startDate, endDate } =
    req.query;
  queryObj = { account, type, status, amount, order, startDate, endDate };
  req.queryObj = queryObj;

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
