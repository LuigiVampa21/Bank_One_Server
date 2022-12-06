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
