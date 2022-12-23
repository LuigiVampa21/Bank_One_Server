const sortingAccounts = accounts => {
let sortedArray = [];
const checkingAccount = findAccountByType(accounts, 'checking');
const savingsAccount = findAccountByType(accounts, 'savings');
const investmentsAccount = findAccountByType(accounts, 'investments');
sortedArray = [checkingAccount, savingsAccount, investmentsAccount]
return sortedArray
}

const findAccountByType = (accounts, type) => {

    const account = [...accounts].filter(a => a.type === type)[0]
    return account
}

module.exports = sortingAccounts;