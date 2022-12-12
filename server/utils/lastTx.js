const BankAccount = require('../models/bankAccount.model')
const Transaction = require('../models/transaction.model')

const sortTx = async (accounts, type) => {
    let txArray = [];
    // Get All TX from all accounts 
    for (const account of accounts) {
        const txAccount = await account.getTransactions()
        txArray = [...txArray, ...txAccount]
    } 

    // Keep only TX where status === settled "status": "settled"
  txArray = [...txArray].filter(tx => tx.status == 'settled')

    // Sort the array by biggest timestamp : updatedAt

txArray.sort((a,b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  }, 0)

//   Then we keep onmy the first TX which will be the lastTX
//   This function will also be util to sort all txs into the transactions section We could implement an extra argument which will tell if we want to return only lastTX or all the Array 

if(type === 'lastTX'){
    return txArray[0]
}

return txArray

}

module.exports = sortTx;