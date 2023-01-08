const Card = require('../../models/card.model');
const Loan = require('../../models/loan.model');
const BankAccount = require('../../models/bankAccount.model')
const createMoneyDayTx = require('./createMoneyDayTX');
const activateLoans = require('./activateLoans');
const sendLoanPaid = require('../../email/sendLoanPaid');
const getUserData = require('../getUserMailAndNameFromBankAccount');
const resetMBATimer = require('./resetMBATimer')
const {Op} = require('sequelize')


const moneyDayFn = async() => {
    console.log('Time to grab some money baby');
    await activateLoans()
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
    const loans = await Loan.findAll({where: {is_active: true}});
    for(const loan of loans){
        const {monthly_payment: amount} = loan
        const account = await loan.getBankAccount();
        await createMoneyDayTx(account,amount)
        await loan.decrement('month_left')
        await loan.save();
        if(loan.month_left == 0){
            const userData = await getUserData(account)            
            await loan.update({
                is_active: false
            })
            await loan.save();
            await sendLoanPaid(userData.name, userData.email, loan.id)
        }
    }
    const masterBA = await BankAccount.findOne({
        where: {
          [Op.and]: [
            { type: "Bank One Ltd." },
            { iban: "LI 0000 0000 0000 0000" }
          ],
        },
      })
      await masterBA.update({
        has_received_money_day: true
      })
      await masterBA.save();

    //   NOW WE NEED TO GET NUMBER OF MILLSECONDS REMAINING TIL THE 6 SO WE SET A TIMER THAT WILL CHANGE BACK THE has_received_money_day PROPERTY TO FALSE;
    
    resetMBATimer(masterBA)

} 


module.exports = moneyDayFn;