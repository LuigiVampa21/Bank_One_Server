const BankAccount = require('../models/bankAccount.model')

const addToSenderKnowAccounts = async (userSending, userReceiving) => {
    const user = userSending;
    const newKnownAccountB = await BankAccount.findOne({
        where: {
            iban: userReceiving
        }
    })
    const newKnownAccountU = await newKnownAccountB.getUser();
    // NOW WE CHECK IF IBAN OF RECEIVER IS ALREADY INTO KNOW ARRAY OF USER SENDER
    if(user.known_accounts === null){
        user.known_accounts = [newKnownAccountU.id];
        await user.save()
    }else if ( !user.known_accounts.includes(newKnownAccountU.id)){
        user.known_accounts = [...user.known_accounts, newKnownAccountU.id]
        await user.save()
    }
    return;
}

// Now we NEED TO FILL THE RECEIVER ARRAY 
module.exports = {addToSenderKnowAccounts};