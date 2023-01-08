const moment = require("moment");
const moneyDayFn = require('./moneyDay');

const timerToMoneyDay = () => {

    let nextFifthUnix;
    const timeOutLimit = 2147483647;
    const currentDay = new Date().getDate();
    const currentTime = new Date().getTime();

    if(currentDay < 5) {
        nextFifthUnix = new Date(moment().date(5)).getTime();
    }else{
        nextFifthUnix = new Date(moment().add(1, "month").date(5)).getTime();
    }
    const timerDuration = +nextFifthUnix - +currentTime;
    if(timerDuration > timeOutLimit){
        const halfTimeDuration = timerDuration / 2;
        setTimeout(() => {
          startTimer(+halfTimeDuration)
        }, +halfTimeDuration)
    }else{
       startTimer(+timerDuration)
    }

}

const startTimer = (duration) => {
    setTimeout(async () => {
        await moneyDayFn()
    }, duration)
};

module.exports = timerToMoneyDay;