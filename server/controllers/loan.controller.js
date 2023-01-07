const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

const User = require("../models/user.model");
// const BankAccount = require("../models/bankAccount.model");
// const Transaction = require("../models/transaction.model");

const CustomError = require("../errors");
const hashString = require("../utils/createHash");
const sendNewLoan = require("../email/sendNewLoan");
const moment = require("../utils/computeStartingDate");

exports.createNewLoan = async (req, res) => {
  const { amount, duration, rate, monthlyTotal, total } = req.body;
  const id = req.user;
  const user = await User.findByPk(id);
  if (!user) {
    throw new CustomError.BadRequestError("No user found with that id");
  }
  const accounts = await user.getBankAccounts();
  if (!accounts) {
    throw new CustomError.BadRequestError(
      "User appears to have no bank account, or they are disabled for some reason"
    );
  }
  const account = [...accounts].filter(a => a.type === "checking")[0];
  if (!accounts) {
    throw new CustomError.BadRequestError(
      "No checking account found, you must first apply for a checking account in order to receive your loan"
    );
  }
  const startingDate = moment.startDate();
  durationMonth = +duration * 12;
  const verificationToken = crypto.randomBytes(40).toString("hex");

  const loan = await account.createLoan({
    amount,
    rate,
    total,
    duration: durationMonth,
    monthly_payment: monthlyTotal,
    verification_token: verificationToken,
    starting_date: startingDate,
  });

  const hashedToken = hashString(verificationToken);

  await sendNewLoan({
    name: user.first_name,
    loan: loan.id,
    account: account.iban,
    amount: loan.amount,
    email: user.email,
    verificationToken: hashedToken,
  });

  res.status(StatusCodes.OK).json({
    data: loan,
  });
};


