const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/user.model");
const Card = require('../models/card.model')
const Transaction = require("../models/transaction.model");
const Loan = require("../models/loan.model");
const txController = require("./transaction.controller");
const CustomError = require("../errors");
const hashString = require("../utils/createHash");
const generateIBAN = require("../utils/generateIBAN");
const cardFactory = require('../utils/initCard')
const getDigitalCardFromBankAccountID = require('../utils/getDigitalCardFromBankAccountID');
const addInsurancesOnCards = require('../utils/addInsurancesOnCards')

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
    user,
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

  if(!user.is_active)
    throw new CustomError.UnauthorizeError('Check your mailbox to confirm your account')

  const comparePassword = await user.checkPassword(password);
  if (!comparePassword)
    throw new CustomError.BadRequestError("Passwords does not match");

  const jwtToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );

  res.status(200).json({
    user,
    token: jwtToken,
    expiry: +process.env.JWT_EXPIRES_IN_SEC
  });
};

exports.logout = async(req,res)=> {
  const user = await User.findByPk(req.user)
  user.update({
    last_active: new Date()
  })
  user.save();
  req.user = ""
  res.status(StatusCodes.OK).json({
    msg: 'logout succesfull'
  })
}

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

  const card = await cardFactory(userAccounts,user, 'digital')

  // res.status(StatusCodes.OK).json({
  //   user,
  //   card,
  //   msg: "Your email has been verified",
  // });
  res.sendFile('verifyEmail.html', {root: './public/pages'})
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

  console.log(process.env.EXP_RESET_PASSWORD);
  console.log(passwordTokenExpirationDate);

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
  // res.status(StatusCodes.OK).json({
  //   transaction,
  // });
  res.sendFile('approveTransaction.html', {root: './public/pages'});
};

exports.approveLoan = async (req, res) => {
  const { token, lnid } = req.query;
  const loan = await Loan.findByPk(lnid);
  if (!loan) {
    throw new CustomError.BadRequestError("No loan to confirmed with that ID");
  }
  if (hashString(loan.verification_token) !== token) {
    throw new CustomError.BadRequestError(
      "This loan cannot be approved with this link, please ask for another link approval"
    );
  }

  // Commented for dev purposes think about to uncomment afterwards
  
  await loan.update({
    type: "confirmed",
    verification_token: "",
  })
  await loan.save();

  const loanTX = await txController.createNewLoanTransaction(loan);


  if(!loanTX){
    throw new CustomError.BadRequestError('We could not approve this loan, please try again later')
  }

  await txController.finalizeTx(loanTX, true)

  // res.status(StatusCodes.OK).json({
  //   loanTX
  // })
  res.sendFile('approveLoan.html', {root: './public/pages'})
  
};

exports.approveInsurance = async(req,res) => {
  const {token, acc: accountID } = req.query;
  if(!token || !accountID)
  throw new CustomError.BadRequestError('Missing info, please try this link again from your mailbox');

  const digitalCard = await getDigitalCardFromBankAccountID(accountID);
  const hashedInsuranceToken = hashString(digitalCard.insurance_token);
  if(hashedInsuranceToken !== token)
  throw new CustomError.BadRequestError('Something went wrong during authentication, please try again');

  const cards = await addInsurancesOnCards(accountID);
  if(!cards)
  throw new CustomError.BadRequestError('Oops something went wrong, Please try again later!')

  await digitalCard.update({
    insurance_token: null
  })
  await digitalCard.save()

  // res.status(StatusCodes.OK).json({
  //   cards
  // })
  res.sendFile('approveInsurance.html', {root: './public/pages'})

}

exports.approveCard = async(req,res) => {
  const {token, card: cardID } = req.query;
  if(!token || !cardID)
  throw new CustomError.BadRequestError('Missing info, please try this link again from your mailbox');

  let card = await Card.findByPk(cardID);
  if(!card)
  throw new CustomError.BadRequestError('Sorry no card seems to be requested here') 

  const hashedActivationToken = hashString(card.activation_token);

  if(hashedActivationToken !== token)
  throw new CustomError.BadRequestError('Something went wrong during authentication, please try again');

  card = await card.update({
    activation_token: null,
    is_active: true,
  })
  await card.save()

  // res.status(StatusCodes.OK).json({
  //   card
  // })

  res.sendFile('approveSecondCard.html', {root: './public/pages'})

}


exports.deleteAccount = async(req,res) => {
  const {token, email } = req.query;
  if(!token || !email)
  throw new CustomError.BadRequestError('Missing info, please try this link again from your mailbox');

  const user = await User.findOne({where: {email}});
  if(!user)
  throw new CustomError.BadRequestError('No User Found') 

  const hashedVerificationToken = hashString(user.verification_token);

  if(hashedVerificationToken !== token)
  throw new CustomError.BadRequestError('Something went wrong during authentication, please try again');

  await user.update({
    is_active: false
  })

  await user.destroy()

  // res.status(StatusCodes.OK).json({
  //   user
  // })

  res.sendFile('deleteAccount.html', {root: './public/pages'})

}

