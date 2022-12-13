const User = require('../models/user.model');
const BankAccount = require('../models/bankAccount.model')

const getBeneficiary = async tx => {
    const {beneficiary} = tx;
    const bankAccount = await BankAccount.findOne({where: {iban: beneficiary}})
    const user = await bankAccount.getUser();
    const formattedName = `${user.last_name} ${user.first_name}`; 
    return formattedName; 
}

module.exports = getBeneficiary;