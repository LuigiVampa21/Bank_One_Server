const BankAccount = require('../models/bankAccount.model')

const getDigitalCardFromBankAccountID = async bankAccountID => {
const bankAccount = await BankAccount.findByPk(bankAccountID);
const cards = await bankAccount.getCards();
const digitalCard = cards.filter(c => c.type === 'digital')
return digitalCard[0]
}

module.exports = getDigitalCardFromBankAccountID;