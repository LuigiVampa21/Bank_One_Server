// const User = require('../models/user.model');

const checkType = async(user, beneficiaryIBAN) => {
    const ibans = [];
    const accounts = await user.getBankAccounts();
    accounts.forEach( a => ibans.push(a.iban));
    const isInternal = ibans.includes(beneficiaryIBAN)
    return isInternal
}

module.exports = checkType;