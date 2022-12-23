const User = require('../models/user.model')
const Transaction = require('../models/transaction.model')

// const findAndSortTx = async (userID, type) => {

// let userIBANs = [];
//   let txFromUser = [];
//   let txToUser = [];
//   const user = await User.findByPk(userID)
//   const accounts = await user.getBankAccounts(); 
//   for (const account of accounts){
//     userIBANs = [...userIBANs, account.iban];
//     const txFromAccount = await account.getTransactions();
//     txFromUser = [... txFromUser, ...txFromAccount];
//   }
//   // const txFromUser = await user
//   // Searching into All DB Txs does not seems really scalable as the application grows, we'll need to change the model 
//   // of as many to many and set an association table with a user sending and a user receiving

//   for (const iban of userIBANs){
//     txToIban = await Transaction.findAll({where: {beneficiary: iban}});
//     txToUser = [...txToUser, ...txToIban]
//   }

//   txToUser.forEach(tx => tx.inflow = true)
//   // We will add the in property on all txs To accounts to be able to add a sign (+ or -) in the front part of our app, but we won't save it on the model.
//   // So next time someone will ask for this txs he'll be able to set or not the in attribute depends is he is sender or receiver

//   const allTxs = [...txFromUser, ...txToUser];

//   allTxs.sort((a,b) => {
//     return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
//   }, 0)

// if(type === 'lastTX'){
//   const resOverview = {
//     accounts,
//     lastTx: allTxs[0] 
//   }
//     return resOverview
// }
// return allTxs;

// }

// HERE we just add a third parameters in order to take into account wether the search data to print docs wether we 
// want txs from all acounts or only one 

const findAndSortTx = async (userID, type, accountQuery=null) => {

  let userIBANs = [];
    let txFromUser = [];
    let txToUser = [];
    const user = await User.findByPk(userID)
    let accounts = await user.getBankAccounts(); 
    if(accountQuery !== null){
      accounts = [...accounts].filter(a => a.type === accountQuery)
    }
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