const {sequelize} = require('../config/connectDB')
const Asset = require('../models/asset.model');
const {StatusCodes} = require('http-status-codes');

exports.getAllAssets = async(req,res) =>{
    const crypto = await Asset.findAll({where: {type: 'crypto'}});
    const stocks = await Asset.findAll({where: {type: 'stock'}});
    const commoditties = await Asset.findAll({where: {type: 'commodity'}});
    const forex = await Asset.findAll({where: {type: 'forex'}});
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