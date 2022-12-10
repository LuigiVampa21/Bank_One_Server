const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/user.model");
const Transaction = require("../models/transaction.model");
const Loan = require("../models/loan.model");
const txController = require("../controllers/transaction.controller");
const CustomError = require("../errors");
const hashString = require("../utils/createHash");
const generateIBAN = require("../utils/generateIBAN");
const sendVerificationEmail = require("../email/sendVerificationEmail");
const sendResetPasswordEmail = require("../email/sendResetPassword");

exports.register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    birthDate,
    confirmPassword,
  } = req.body;

  const alreadyExistingUser = await User.findOne({ where: { email } });
  if (alreadyExistingUser) {
    throw new CustomError.BadRequestError("User with email already exists!");
  }
  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    first_name: firstName,
    last_name: lastName,
    email: email,
    phone_number: phone,
    birth_date: birthDate,
    password: password,
    confirmed_password: confirmPassword,
    verification_token: verificationToken,
    // image: "/images/" + req.file.filename,
  });

  if (!user) {
    throw new CustomError.BadRequestError(
      "Sorry could not create new User, Please try again later"
    );
  }

  const checking = user.createBankAccount({
    type: "checking",
    iban: generateIBAN(),
  });

  const savings = user.createBankAccount({
    type: "savings",
    iban: generateIBAN(),
  });

  const investments = user.createBankAccount({
    type: "investments",
    iban: generateIBAN(),
  });

  await Promise.all([checking, savings, investments]);

  await sendVerificationEmail(
    user.first_name,
    user.email,
    user.verification_token
  );

  res.status(StatusCodes.CREATED).json({
    data: user,
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError(
      "Please provide email and/or password"
    );
  }
  const user = await User.findOne({ where: { email } });
  if (!user)
    throw new CustomError.BadRequestError("No user found with that email");

  const comparePassword = await user.checkPassword(password);
  if (!comparePassword)
    throw new CustomError.BadRequestError("Passwords does not match");

  const jwtToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET
  );

  res.status(200).json({
    user,
    token: jwtToken,
  });
};

exports.verifyEmail = async (req, res) => {
  const { token, email } = req.query;
  if (!token) {
    throw new CustomError.BadRequestError(
      "Sorry, we're unable to verify your email"
    );
  }
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new CustomError.BadRequestError(
      "Sorry, we're unable to verify your email"
    );
  }
  if (token !== user.verification_token) {
    throw new CustomError.BadRequestError(
      "Oops, something wrong went down, please try again later!"
    );
  }

  user.is_active = true;
  user.verification_token = "";
  await user.save();

  const userAccounts = await user.getBankAccounts();

  userAccounts.forEach(async account => {
    account.is_active = true;
    await account.save();
  });

  res.status(StatusCodes.OK).json({
    user,
    msg: "Your email has been verified",
  });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError("Please provide email");
  }
  const user = await User.findOne({ where: { email } });
  if (!user)
    throw new CustomError.BadRequestError("No user found with that email");

  const passwordToken = crypto.randomBytes(70).toString("hex");
  const passwordTokenExpirationDate = new Date(
    Date.now() + eval(process.env.EXP_RESET_PASSWORD)
  );

  await sendResetPasswordEmail({
    name: user.name,
    email: user.email,
    token: passwordToken,
  });

  user.reset_password_token = hashString(passwordToken);
  user.reset_password_expires = passwordTokenExpirationDate;
  await user.save();

  res.status(StatusCodes.OK).json({
    data: user,
    msg: "Please check your email to reset your password",
  });
};

exports.resetPassword = async (req, res) => {
  const { token, email } = req.query;
  const { password } = req.body;
  if (!token || !email || !password) {
    throw new CustomError.BadRequestError("Invalid credentials");
  }

  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new CustomError.BadRequestError(
      "Sorry, we're unable to verify your email"
    );
  }

  const now = new Date();
  if (
    user.reset_password_token === hashString(token) &&
    user.reset_password_expires > now
  ) {
    user.password = password;
    user.reset_password_token = null;
    user.reset_password_expires = null;
    await user.save();
  }
  res.status(StatusCodes.OK).json({
    data: user,
    msg: "Your password has been updated",
  });
};

exports.confirmTx = async (req, res) => {
  const { token, txid } = req.query;
  if (!token || !txid) {
    throw new CustomError.BadRequestError(
      "Sorry, we're unable to verify the transaction with the informations you provided"
    );
  }
  const transaction = await Transaction.findByPk(txid);
  if (!transaction) {
    throw new CustomError.BadRequestError(
      "Sorry, this transaction has not been requested, or has not been treated yet by our services"
    );
  }
  const txToken = transaction.verification_token;

  if (token !== txToken) {
    throw new CustomError.BadRequestError(
      "The transaction you are requesting cannot be setlled, please try again later"
    );
  }
  const newTx = await transaction.update({
    verification_token: null,
    status: "settled",
  });
  if (newTx) {
    txController.finalizeTx(transaction);
  }
  res.status(StatusCodes.OK).json({
    transaction,
  });
};

exports.approveLoan = async (req, res) => {
  const { token, lnid } = req.params;
  const loan = await Loan.findByPk(lnid);
  if (!loan) {
    throw new CustomError.BadRequestError("No loan to confirmed with that ID");
  }
  if (hashString(loan.verification_token) !== token) {
    throw new CustomError.BadRequestError(
      "This loan cannot be approved with this link, please ask for another link approval"
    );
  }
  
};
