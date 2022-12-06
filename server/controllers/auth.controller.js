const { Sequelize } = require("sequelize");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/user.model");
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

exports.verifyEmail = async (req, res) => {
  const { token, email } = req.query;
  if (!token) {
    throw new CustomError.BadRequestError(
      "Sorry, we're unable to verify your email"
    );
  }
  console.log(token, email);
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new CustomError.BadRequestError(
      "Sorry, we're unable to verify your email"
    );
  }
  console.log(user);
  if (token === user.verification_token) {
    user.is_active = true;
  }

  const userAccounts = await user.getBankAccounts();

  console.log("-----------------------------------------");
  console.log(userAccounts);

  res.status(StatusCodes.OK).json({
    user,
    userAccounts,
  });
};
