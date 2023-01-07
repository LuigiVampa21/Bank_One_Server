const Card = require('../../models/card.model')


const moneyDayFn = async() => {
    console.log('Time to grab some money baby');
    const digitalCards = await Card.findAll({where: { type : "digital"} });
    
} 

module.exports = moneyDayFn;