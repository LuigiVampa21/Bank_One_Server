// const axios = require('axios');
// const cryptoController = require('../trading-controllers/crypto.controller')

// const createCryptoAsset = async() => {
//     try{
//         const assets = await axios.get(process.env.CRYPTO_API + '/markets?vs_currency=USD&order=gecko_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h',
//          { 
//             headers: { 
//                         "Accept-Encoding": "gzip,deflate,compress" 
//                      } 
//          }
//         );
//         for (const _asset of assets.data){
//             const asset = await cryptoController.assetFactory(_asset, 'crypto')
//             // console.log(asset);
//         }
//     }catch(err){
//         console.error(err);
//     }
// }

// module.exports = createCryptoAsset;