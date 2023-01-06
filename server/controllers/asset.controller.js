const {sequelize} = require('../config/connectDB')
const Asset = require('../models/asset.model');
const {StatusCodes} = require('http-status-codes');
const sortArray = require('../utils/sortAssets');

exports.getAllAssets = async(req,res) =>{
    const crypto = sortArray(await Asset.findAll({where: {type: 'crypto'}}));
    const stocks = sortArray(await Asset.findAll({where: {type: 'stock'}}));
    const commoditties = sortArray(await Asset.findAll({where: {type: 'commodity'}}));
    const forex = sortArray(await Asset.findAll({where: {type: 'forex'}}));
    const assets = {
        crypto,
        stocks,
        commoditties,
        forex
    }
    res.status(StatusCodes.OK).json({
        assets
    })
}

exports.getSingleAsset = async(req,res) =>{
    const {id} = req.params;
    const asset = await Asset.findByPk(id);
    res.status(StatusCodes.OK).json({
        asset
    })
}