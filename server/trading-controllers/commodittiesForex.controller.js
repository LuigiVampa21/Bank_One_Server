const Asset = require('../models/asset.model');
const {StatusCodes} = require('http-status-codes');

const percentage = require('calculate-percentages')

const FOREX = ["EUR", "JPY", "GBP"];
const COMMODITTIES = ["XAU", "XAG", "WTIOIL"];

exports.createAsset = async(req,res) => {
    let { id, name, type, image, price, last_closing_price } = req.body;
    price = 1/ +price;
    last_closing_price = 1/ +last_closing_price;
    const one_day_change = percentage.differenceBetween(last_closing_price, price);
    const asset = await Asset.create({ id, name, type, image, price, one_day_change });
    res.status(StatusCodes.OK).json({
        asset
    })
    
}

exports.deleteAsset = async (req,res) => {
    const asset = await Asset.findByPk('JPY')
    await asset.destroy({force: true})
}