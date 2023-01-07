const BankAccount = require('../../models/bankAccount.model');
const moneyDayFn = require('./moneyDay');
const timerToMoneyDay = require('./timerToMoneyDate')

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
    }else{
        timerToMoneyDay()
    }
}

module.exports = checkDate;