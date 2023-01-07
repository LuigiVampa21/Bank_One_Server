const BankAccount = require('../../models/bankAccount.model');
const moneyDayFn = require('./moneyDay');
const timerToMoneyDay = require('./timerToMoneyDate')
const {Op} = require('sequelize')

const checkDate = async () => {
    const currentDate = new Date().getDay();
    const masterBA = await BankAccount.findOne({
        where: {
          [Op.and]: [
            { type: "Bank One Ltd." },
            { iban: "LI 0000 0000 0000 0000" }
          ],
        },
      })
    if(currentDate === 5 && !masterBA.has_received_money_day){
        await moneyDayFn()
    }else if(currentDate === 5 && masterBA.has_received_money_day){
        timerToMoneyDay()
    }else{
        if(masterBA.has_received_money_day){
            await masterBA.update({
                has_received_money_day: false
            })
            await masterBA.save();
        }
        timerToMoneyDay()
    }
}

module.exports = checkDate;