const Asset = require('../models/asset.model');
const {StatusCodes} = require('http-status-codes');
const { Op } = require("sequelize");
const rates = require('../data/cmdtFx')

const percentage = require('calculate-percentages');
const { default: axios } = require('axios');

// const FOREX = ["EUR", "JPY", "GBP"];
// const COMMODITTIES = ["XAU", "XAG", "WTIOIL"];

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

exports.updateCmdtsForexPrice = async() => {
    let ratesArrayofObject = [];
    const cmdtsForexAssetsFromDB = await Asset.findAll({where: {
        [Op.or]: [{type: 'forex'},{type: 'commodity'}]
    }});
    const cmdtsForexIDFromDB = [...cmdtsForexAssetsFromDB].map((c,i) => c = c.id.toUpperCase());
    // const response = await axios.get(process.env.CMDTS_FOREX_UPDATE_URL, { 
    //     headers: { 
    //                 "Accept-Encoding": "gzip,deflate,compress" 
    //              } 
    //  });
    // const {rates} = response.data.data;
    // console.log(rates);

    const ratesArray = Object.entries(rates)
    for (const rate of ratesArray){
        ratesArrayofObject = [...ratesArrayofObject, {id: rate[0], price: rate[1]}]
    }
    // console.log(ratesArrayofObject);
    // console.log(cmdtsForexAssetsFromDB);
    // console.log(cmdtsForexIDFromDB);

    for(const asset of ratesArrayofObject){
        if(cmdtsForexIDFromDB.includes(asset.id)){
            const cmdt = await Asset.findOne({where: {id: asset.id}})
            // console.log(cmdt.toJSON());
            // await cmdt.update({
            //     price
            // })
            // console.log(assetToUpdate.id, assetToUpdate.price);
        }
    }

}

exports.deleteAsset = async (req,res) => {
    const asset = await Asset.findByPk('JPY')
    await asset.destroy({force: true})
}