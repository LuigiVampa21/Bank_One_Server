const moment = require('moment')

const resetMBATimer = (masterBA) => {
    const currentUnix = new Date().getTime();
    const nextSixthUnix = new Date(moment().date(6).hours(1).minutes(0).seconds(0)).getTime();
    console.log(currentUnix);
    console.log(nextSixthUnix);
    const unixDiff = +nextSixthUnix - +currentUnix;
    console.log(unixDiff);
    setTimeout(async() => {
        await masterBA.update({
            has_received_money_day: false
        })
        await masterBA.save();
    })
}

module.exports = resetMBATimer;