const cryptoController = require('../trading-controllers/crypto.controller')
const commodittiesForexController = require('../trading-controllers/commodittiesForex.controller') 
const stockController = require('../trading-controllers/stocks.controller')
const io = require('../app')

// console.log(io);

// REPLACE AFTER DEV PURPOSES


const cryptoStocksUpdate = (io) => {
    setInterval( async () => {
   await cryptoController.updateCryptoPrice()
   await stockController.updateStockPrice()
   io.emit('prices updated')
// }, 10000 )
}, 60000 )

};

module.exports = cryptoStocksUpdate;

// const cmdtsForexUpdate = () => {
//     setInterval(() => {
//         commodittiesForexController.updateCmdtsForexPrice()
//         // 43,200,000 = 12H
//     // }, 60000 )
//      }, 43200000 )
// };


// const autoUpdateAssets = () => {
//     const currentDateSeconds = new Date().getSeconds();
//         if (currentDateSeconds == 0) {
//             cryptoStocksUpdate()
//             cmdtsForexUpdate()
//             }
//         else {
//             setTimeout(function () {
//                 autoUpdateAssets();
//             }, (60 - currentDateSeconds) * 1000);
//         }
// }


// module.exports = autoUpdateAssets;