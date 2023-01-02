const cryptoController = require('../trading-controllers/crypto.controller')


const setTimer = () => {

    const currentDateSeconds = new Date().getSeconds();
    if (currentDateSeconds == 0) {
        setInterval(() => {
            cryptoController.updateCryptoPrice()
        }, 60000 );
        // }, 10000 );
    }
    else {
        setTimeout(function () {
            setTimer();
        }, (60 - currentDateSeconds) * 1000);
    }
    
}


module.exports = setTimer;