const User = require('../models/user.model');
const Card = require('../models/card.model');
const {StatusCodes} = require('http-status-codes');
const getCheckingAccountFromUserID = require('../utils/getCheckingAccountFromUserID')
const cardFactory = require('../utils/initCard')


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
    const {id} = req.params;
    const card = await Card.findByPk(id);
    const newCard = await card.update({
        insurances: true
    }) 
    newCard.save();
    res.status(StatusCodes.OK).json({
        newCard
    })
}

