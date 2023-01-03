const cryptoController = require('../trading-controllers/crypto.controller')
const commodittiesForexController = require('../trading-controllers/commodittiesForex.controller') 

const cryptoUpdate = () => {
    setInterval(() => {
   cryptoController.updateCryptoPrice()
}, 60000 )
};

const cmdtsForexUpdate = () => {
    setInterval(() => {
        commodittiesForexController.updateCmdtsForexPrice()
        // 43,200,000 = 12H
    // }, 60000 )
     }, 43200000 )
}


const autoUpdateAssets = () => {

    const currentDateSeconds = new Date().getSeconds();
    if (currentDateSeconds == 0) {
        cryptoUpdate()
        cmdtsForexUpdate()
        }
    else {
        setTimeout(function () {
            autoUpdateAssets();
        }, (60 - currentDateSeconds) * 1000);
    }
    
}


module.exports = autoUpdateAssets;