const Asset = require('../models/asset.model');
const {StatusCodes} = require('http-status-codes');

const percentage = require('calculate-percentages')

exports.createStockAsset = async(req,res) => {
    const { id, name, type, image, price, last_closing_price } = req.body;
    const one_day_change = percentage.differenceBetween(last_closing_price, price);
    const asset = await Asset.create({ id, name, type, image, price, one_day_change });
    res.status(StatusCodes.OK).json({
        asset
    })
    
}