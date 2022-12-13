const User = require('../models/user.model')
// const BankAccount = require('../models/bankAccount.model')
const Transaction = require('../models/transaction.model')

const findAndSortTx = async (userID, type) => {
//     let txArray = [];
//     // Get All TX from all accounts 
//     for (const account of accounts) {
//         const txAccount = await account.getTransactions()
//         txArray = [...txArray, ...txAccount]
//     } 

//     // Keep only TX where status === settled "status": "settled"
//   txArray = [...txArray].filter(tx => tx.status == 'settled')

//     // Sort the array by biggest timestamp : updatedAt

// txArray.sort((a,b) => {
//     return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
//   }, 0)

// //   Then we keep onmy the first TX which will be the lastTX
// //   This function will also be util to sort all txs into the transactions section We could implement an extra argument which will tell if we want to return only lastTX or all the Array 

// if(type === 'lastTX'){
//     return txArray[0]
// }

// return txArray

let userIBANs = [];
  let txFromUser = [];
  let txToUser = [];
  const user = await User.findByPk(userID)
  const accounts = await user.getBankAccounts(); 
  for (const account of accounts){
    userIBANs = [...userIBANs, account.iban];
    const txFromAccount = await account.getTransactions();
    txFromUser = [... txFromUser, ...txFromAccount];
  }
  // const txFromUser = await user
  // Searching into All DB Txs does not seems really scalable as the application grows, we'll need to change the model 
  // of as many to many and set an association table with a user sending and a user receiving

  for (const iban of userIBANs){
    txToIban = await Transaction.findAll({where: {beneficiary: iban}});
    txToUser = [...txToUser, ...txToIban]
  }

  txToUser.forEach(tx => tx.inflow = true)
  // We will add the in property on all txs To accounts to be able to add a sign (+ or -) in the front part of our app, but we won't save it on the model.
  // So next time someone will ask for this txs he'll be able to set or not the in attribute depends is he is sender or receiver

  const allTxs = [...txFromUser, ...txToUser];

  allTxs.sort((a,b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  }, 0)

if(type === 'lastTX'){
  const resOverview = {
    accounts,
    lastTx: allTxs[0] 
  }
    return resOverview
}
return allTxs;

}

module.exports = findAndSortTx;