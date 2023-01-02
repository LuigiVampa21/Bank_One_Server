const Asset = require('../models/asset.model');
const axios = require('axios');

exports.assetFactory = async (_asset, type) => {
    const asset = await Asset.create({
        id: _asset.symbol,
        name: _asset.id,
        type,
        image: _asset.image,
        price: _asset.current_price,
        last_update: _asset.last_updated,
        one_day_change: _asset.price_change_percentage_24h_in_currency
    });
    return asset;
}

exports.updateCryptoPrice = async() => {
    let assetsDataFromAPI = [];
    let assetsIDFromDB = [];
    const response = await axios.get(process.env.CRYPTO_UPDATE_URL, { 
                    headers: { 
                                "Accept-Encoding": "gzip,deflate,compress" 
                             } 
                 });
    
    for(const asset of response.data){
        assetsDataFromAPI = [...assetsDataFromAPI, {id: asset.symbol, price: asset.current_price, one_day_change: asset.price_change_percentage_24h_in_currency}]
    }
    const cryptos = await Asset.findAll({where: {type: 'crypto'}})
    cryptos.forEach(crypto => assetsIDFromDB = [...assetsIDFromDB, crypto.id])
    for(const dataObj of assetsDataFromAPI){
        if(assetsIDFromDB.includes(dataObj.id)){
            const crypto = await Asset.findOne({where:{id: dataObj.id}})
            console.log('-------------------------------------------------------------');
            console.log(crypto.id, crypto.price, crypto.one_day_change);
            await crypto.update({
                price: dataObj.price,
                one_day_change: dataObj.one_day_change,
                last_update: new Date()
            })
            await crypto.save()
            console.log(crypto.id, crypto.price, crypto.one_day_change);
            console.log('-------------------------------------------------------------');
        }
    }
}