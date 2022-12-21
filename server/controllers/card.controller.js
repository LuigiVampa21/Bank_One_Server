const User = require('../models/user.model');
const Card = require('../models/card.model');
const {StatusCodes} = require('http-status-codes');
const getCheckingAccountFromUserID = require('../utils/getCheckingAccountFromUserID');
const cardFactory = require('../utils/initCard');
// const addInsuranceForSecondCard = require('../utils/addInsurancesOnCards');
const sendInsuranceApproval = require('../email/sendInsuranceApproval');
const sendSecondCardApproval = require('../email/sendSecondCardApproval');
const CustomError = require('../errors')
const crypto = require("crypto");
const hashString = require("../utils/createHash");

// const getDigitalCardFromBankAccountID = require('../utils/getDigitalCardFromBankAccountID');


exports.getAllUserCards = async(req,res) => {

    const checkingAccount = await getCheckingAccountFromUserID(req.user)
    const card = await checkingAccount.getCards()

    res.status(StatusCodes.OK).json({
        card
    })
}

exports.createCard = async(req,res) => {
    const user = await User.findByPk(req.user)
    const accounts = await user.getBankAccounts();
    const card = await cardFactory(accounts,user, 'physical')
    res.status(StatusCodes.CREATED).json({
        card
    })    
}

exports.updateCardInsurances = async(req,res) =>{

    const user = await User.findByPk(req.user);
    if(!user)
    throw new CustomError.UnauthenticatedError('You are not authorized to access this route');
    const {id} = req.params;
    const card = await Card.findByPk(id);
    if(card.insurance)
        throw new CustomError.BadRequestError('You already have an insurance');
    const token = crypto.randomBytes(70).toString("hex");

    await card.update({insurance_token: token})
    await card.save()

    const verificationToken = hashString(token);
  
    await sendInsuranceApproval({
        name: user.first_name,
        accountID: card.BankAccountId,
        email: user.email,
        verificationToken,
    })

    
    res.status(StatusCodes.OK).json({
        card
    })
}

exports.applyForSecondCard = async(req,res) =>{

    const user = await User.findByPk(req.user);
    if(!user)
    throw new CustomError.UnauthenticatedError('You are not authorized to access this route');

    const accounts = await user.getBankAccounts()
    const account = await getCheckingAccountFromUserID(user.id);
    const cards = await account.getCards();
    if(cards.length > 1)
        throw new CustomError.BadRequestError('You already have a physical card');
        // automatically add insurance if first card has it
    const {insurance} = cards[0];
    let card = await cardFactory(accounts, user, 'physical')
    const token = crypto.randomBytes(70).toString("hex");

    card = await card.update({
        activation_token: token,
        is_active: false,
        insurance
    })
    await card.save()

    const verificationToken = hashString(token);
  
    await sendSecondCardApproval({
        name: user.first_name,
        cardID: card.id,
        email: user.email,
        verificationToken,
    })

    
    res.status(StatusCodes.OK).json({
        card
    })
}

