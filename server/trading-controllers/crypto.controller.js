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
    const response = await axios.get(process.env.CRYPTO_UPDATE_URL, { 
                    headers: { 
                                "Accept-Encoding": "gzip,deflate,compress" 
                             } 
                 });
    console.log(response.data);
}