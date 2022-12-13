const User = require('../models/user.model');

const getCheckingAccountFromUserID = async (userID) => {
    const user = await User.findByPk(userID)
    const accounts = await user.getBankAccounts();
    const checkingAccount = accounts.filter(a => a.type === 'checking')[0];
    return checkingAccount
}

module.exports = getCheckingAccountFromUserID;