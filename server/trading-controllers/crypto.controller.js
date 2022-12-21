const Asset = require('../models/asset.model')

exports.assetFactory = async (_asset, type) => {
    const asset = await Asset.create({
        id: asset.symbol,
        name: asset.id,
        type,
        image: asset.image,
        price: asset.current_price,
        last_update: asset.last_updated,
        one_day_change: asset.price_change_percentage_24h_in_currency
    });
    return asset;
}