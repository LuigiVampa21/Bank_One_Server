const moment = require('moment');
// const checkDate = require('./checkDate');
const timerToMoneyDay = require('./timerToMoneyDate');

const resetMBATimer = (masterBA) => {
    const currentUnix = new Date().getTime();
    const nextSixthUnix = new Date(moment().date(6).hours(1).minutes(0).seconds(0)).getTime();
    const unixDiff = +nextSixthUnix - +currentUnix;
    setTimeout(async() => {
        await masterBA.update({
            has_received_money_day: false
        })
        await masterBA.save();
        timerToMoneyDay()
    }, unixDiff)
}

module.exports = resetMBATimer;