// const Card = require('../models/card.model');
// const BankAccount = require('../models/bankAccount.model');
const generator = require('creditcard-generator')

const cardFactory = async (accounts, user, type) => {
    const {first_name, last_name} = user
    const account = [...accounts].filter(a => a.type === 'checking')[0]
    const card_numbers = generator.GenCC("VISA");
    const placeholder = `${last_name.toUpperCase()} ${first_name.toUpperCase()}`
    const cvc = new Date().getTime().toString().slice(-3);
    const month = new Date().getMonth()
    const year = new Date().getFullYear().toString().slice(-2)
    const expiration_date = `${month}/${year}`

    const card = await account.createCard({
        type: type,
        card_numbers,
        placeholder,
        cvc,
        expiration_date
    })

    return card
}

module.exports = cardFactory;