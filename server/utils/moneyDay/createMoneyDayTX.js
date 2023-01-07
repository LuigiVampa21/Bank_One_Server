const transactionController = require('../../controllers/transaction.controller');
const CustomError = require('../../errors')

const createMoneyDayTx = async (account, amount) => {
    const moneyDayTX = await account.createTransaction({
        amount,
        description: "Account Management Fees",
        beneficiary: "LI 0000 0000 0000 0000",
        beneficiary_name: "Bank One Ltd.",
        type: "external",
        inflow: false,
    })
if(!moneyDayTX) {
    throw new CustomError.BadRequestError(`Sorry could not create that transaction on that account: ${account.id}`)
};
await transactionController.finalizeTx(moneyDayTX, true)

}


module.exports = createMoneyDayTx;