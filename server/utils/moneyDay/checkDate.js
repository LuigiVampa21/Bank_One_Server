const BankAccount = require('../../models/bankAccount.model');

const checkDate = async () => {
    const currentDate = new Date().getDay();
    if(currentDate === 5){
        const masterBA = await BankAccount.findOne({
            where: {
              [Op.and]: [
                { type: "Bank One Ltd." },
                { iban: "LI 0000 0000 0000 0000" }
              ],
            },
          })
          if(masterBA.has_received_money_day) return;
          
    }
}

module.exports = checkDate;