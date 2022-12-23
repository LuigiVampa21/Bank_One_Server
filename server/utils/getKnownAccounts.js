const User = require('../models/user.model')

const getKnownAccounts = async(userID) => {

    let knownAccountsObj = [];
    const user = await User.findByPk(userID);
    const {known_accounts: knownAccounts} = user;

    for (const id of knownAccounts){
        const user = await User.findByPk(id);
        knownAccountsObj = [...knownAccountsObj, {
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
        }]
    }

    return knownAccountsObj;
    }

module.exports = getKnownAccounts;