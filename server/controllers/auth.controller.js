const { Sequelize } = require("sequelize");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/user.model");
const CustomError = require("../errors");
const hashString = require("../utils/createHash");
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

  // user.bulkCreateBankAccount([
  //   {
  //     type: "checking",
  //   },
  //   {
  //     type: "savings",
  //   },
  //   {
  //     type: "investments",
  //   },
  // ]);

  const checking = await user.createBankAccount({
    type: "checking",
  });

  const savings = await user.createBankAccount({
    type: "savings",
  });

  const investments = await user.createBankAccount({
    type: "investments",
  });

  // const resolve = await Promise.all([checking, savings, investments]);

  // console.log(checking, savings, investments);
  // console.log(await checking);

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
  const { token, email } = req.params;
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

  // async () => {
  // await user.createBankAccount({
  //   type: "checking",
  // });
  // await user.createBankAccount({
  //   type: "savings",
  // });
  // await user.createBankAccount({
  //   type: "investments",
  // });

  // const [
  //   a = user.createBankAccount({
  //     type: "checking",
  //   }),
  //   b = user.createBankAccount({
  //     type: "savings",
  //   }),
  //   c = user.createBankAccount({
  //     type: "investments",
  //   }),
  // ] = await Promise.all([a(), b(), c()]);
  // console.log(a, b, c);
  res.status(StatusCodes.OK).json({
    user,
  });
};
