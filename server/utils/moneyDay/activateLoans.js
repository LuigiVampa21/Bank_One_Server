const Loan = require('../../models/loan.model')
const { Op } = require("sequelize");

const activateLoans = async() => {
    const loans = await Loan.findAll({
        where: {
            [Op.and]: [{is_active: false},{month_left:{[Op.gt]: 0}}]
        }
    })
    for (const loan of loans){
        const currentDateOnly = new Date().toISOString().split('T')[0];
        const loanStartingDate = loan.starting_date;
        // We need to check if date is the same, cause a loan made in the same month but before the 
        // fifth will start the month after, so we can't activate it rught now.
        if(loanStartingDate != currentDateOnly) return;
        await loan.update({
            is_active: true
        })
        await loan.save();
    }
}


module.exports = activateLoans;