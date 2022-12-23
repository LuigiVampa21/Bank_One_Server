const BankAccount = require('../models/bankAccount.model')

const addToSenderKnownAccounts = async (userSending, userReceiving) => {
    const user = userSending;
    const newKnownAccountB = await BankAccount.findOne({
        where: {
            iban: userReceiving
        }
    })
    const newKnownAccountU = await newKnownAccountB.getUser();
    if(user.known_accounts === null){
        user.known_accounts = [newKnownAccountU.id];
        await user.save()
    }else if (!user.known_accounts.includes(newKnownAccountU.id)){
        user.known_accounts = [...user.known_accounts, newKnownAccountU.id]
        await user.save()
    }
    // console.log(user.toJSON());
    return;
}

const addToReceiverKnownAccounts = async (accountSending, accountReceiving) => {
    const userSending = await accountSending.getUser();
    const userReceiving = await accountReceiving.getUser();
    if(userReceiving.known_accounts === null){
        userReceiving.known_accounts = [userSending.id]
    }else if(!userReceiving.known_accounts.includes(userSending.id)){
        userReceiving.known_accounts = [...userReceiving.known_accounts, userSending.id]
    }
    // console.log(userReceiving.toJSON());
    return;
} 

module.exports = {addToSenderKnownAccounts, addToReceiverKnownAccounts};