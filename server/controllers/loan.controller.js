const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");
const CustomError = require("../errors");
const hashString = require("../utils/createHash");

exports.createNewLoan = async (req, res) => {
  const { amount, duration, rate, monthlyTotal, total } = body;
  const { id } = req.user;
  const user = await User.findByPk(id);
//   user.createLoan
  res.status(200).json({
    msg: "ok",
  });
};
