const User = require('../models/user.model')
const getCheckingAccountFromUserID = require('./getCheckingAccountFromUserID')

const getKnownAccounts = async(userID) => {

    let knownAccountsObj = [];
    const user = await User.findByPk(userID);
    const {known_accounts: knownAccounts} = user;

    for (const id of knownAccounts){
        const user = await User.findByPk(id);
        const checkingAccount = await getCheckingAccountFromUserID(id)
        const {iban} = checkingAccount; 
        knownAccountsObj = [...knownAccountsObj, {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            iban 
        }]
    }

    return knownAccountsObj;
    }

module.exports = getKnownAccounts;