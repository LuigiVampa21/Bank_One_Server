const cryptoController = require('../trading-controllers/crypto.controller')

const cryptoUpdate = () => {
    setInterval(() => {
   cryptoController.updateCryptoPrice()
}, 60000 )
};


const autoUpdateAssets = () => {

    const currentDateSeconds = new Date().getSeconds();
    if (currentDateSeconds == 0) {
        cryptoUpdate()
        }
    else {
        setTimeout(function () {
            autoUpdateAssets();
        }, (60 - currentDateSeconds) * 1000);
    }
    
}


module.exports = autoUpdateAssets;