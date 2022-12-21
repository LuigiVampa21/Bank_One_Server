const BankAccount = require('../models/bankAccount.model');

const addInsurancesOnCards = async accountID => {
const account = await BankAccount.findByPk(accountID);
const cards = await account.getCards()
for (const card of cards){
    await card.update({
        insurance: true
        // insurance: false
    })
    await card.save()
}
return cards;
}

module.exports = addInsurancesOnCards;