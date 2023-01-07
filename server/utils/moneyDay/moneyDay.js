const Card = require('../../models/card.model');
const BankAccount = require('../../models/bankAccount.model')
const createMoneyDayTx = require('./createMoneyDayTX');


const moneyDayFn = async() => {
    console.log('Time to grab some money baby');
    const digitalCards = await Card.findAll({where: { type : "digital"}});
    for (const digitalCard of digitalCards){
        const account = await digitalCard.getBankAccount();
        const amount = digitalCard.insurance ? 15 : 5;
        await createMoneyDayTx(account,amount)
    }
    const physicalCards = await Card.findAll({where: { type : "physical"}});
    for (const physicalCard of physicalCards){
        const account = await physicalCard.getBankAccount();
        const amount = 5;
        await createMoneyDayTx(account,amount)
    }

} 

// moneyDayFn()

module.exports = moneyDayFn;