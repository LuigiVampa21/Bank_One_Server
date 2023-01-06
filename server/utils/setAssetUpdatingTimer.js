const cryptoController = require('../trading-controllers/crypto.controller')
const commodittiesForexController = require('../trading-controllers/commodittiesForex.controller') 
const stockController = require('../trading-controllers/stocks.controller')
const io = require('../app')


const cryptoStocksUpdate = () => {
    setInterval( async () => {
   await cryptoController.updateCryptoPrice()
   await stockController.updateStockPrice()
   io.emit('prices updated')
}, 60000 )
};

const cmdtsForexUpdate = () => {
    setInterval(() => {
        commodittiesForexController.updateCmdtsForexPrice()
        // 43,200,000 = 12H
    // }, 60000 )
     }, 43200000 )
};

const autoUpdateAssets = () => {
    const currentDateSeconds = new Date().getSeconds();
        if (currentDateSeconds == 0) {
            cryptoStocksUpdate()
            cmdtsForexUpdate()
            }
        else {
            setTimeout(function () {
                autoUpdateAssets();
            }, (60 - currentDateSeconds) * 1000);
        }
}


module.exports = autoUpdateAssets;