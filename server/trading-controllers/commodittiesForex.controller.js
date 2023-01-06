const Asset = require('../models/asset.model');
const {StatusCodes} = require('http-status-codes');
const { Op } = require("sequelize");
// const ratesLatest = require('../data/cmdtFx-latest')
// const ratesFluctuations = require('../data/cmdtFx-fluctuation')
const moment = require('moment')

const percentage = require('calculate-percentages');
const axios = require('axios');

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

   const today = new Date().toISOString().split('T')[0]
   const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')

//    console.log(today, yesterday);
const api_url = `${process.env.COMMODITTIES_API_URL}/fluctuation?access_key=${process.env.COMMODITTIES_API_KEY}&start_date=${yesterday}&end_date=${today}&base=USD&symbols=${process.env.COMMODITTIES_API_SYMBOLS}`

    // let ratesArrayofObject = [];
    const cmdtsForexAssetsFromDB = await Asset.findAll({where: {
        [Op.or]: [{type: 'forex'},{type: 'commodity'}]
    }});
    const cmdtsForexIDFromDB = [...cmdtsForexAssetsFromDB].map((c,i) => c = c.id);


    // --------------------------------------------------------------- FETCH WITH FLUCTUATIONS --------------------------------------------------
    
    const response = await axios.get(api_url, { 
            headers: { 
                            "Accept-Encoding": "gzip,deflate,compress" 
                         } 
             });
            const {rates: ratesFluctuations} = response.data.data;
            let assetsDataFromAPI = []; 
            // console.log(ratesFluctuations);    
            const ratesArray = Object.entries(ratesFluctuations)
            // console.log(ratesArray);    
            for(const rate of ratesArray){
                const id = rate[0];
                const price = 1/rate[1].end_rate;
                const one_day_change = rate[1].change_pct;
                const obj = {id, price, one_day_change}
                assetsDataFromAPI = [...assetsDataFromAPI, obj]
            }
            for(const dataObj of assetsDataFromAPI){
                if(cmdtsForexIDFromDB.includes(dataObj.id)){
                    const cmdt = await Asset.findByPk(dataObj.id);
                        const last_price_db = cmdt.price;
                        const last_price_api = dataObj.price;
                        const one_day_change = last_price_db > last_price_api ? -dataObj.one_day_change : dataObj.one_day_change;
                        await cmdt.update({
                            one_day_change,
                            price: last_price_api,
                            last_update: new Date()
                        })
                        await cmdt.save();
                        console.log(cmdt.toJSON());
                }
            }         
            
 // ---------------------------------------------------------- FETCH WITH LATEST ----------------------------------------------------------
            
            // const response = await axios.get(process.env.CMDTS_FOREX_UPDATE_URL, { 
                //     headers: { 
                    //                 "Accept-Encoding": "gzip,deflate,compress" 
                    //              } 
                    //  });
                    // const {rates} = response.data.data;
                    // console.log(rates);
                // const ratesArray = Object.entries(rates)
    // for (const rate of ratesArray){
    //     ratesArrayofObject = [...ratesArrayofObject, {id: rate[0], price: rate[1]}]
    // }
    // console.log(ratesArrayofObject);
    // console.log(cmdtsForexAssetsFromDB);
    // console.log(cmdtsForexIDFromDB);

    // for(const asset of ratesArrayofObject){
    //     if(cmdtsForexIDFromDB.includes(asset.id)){
    //         console.log(asset.id);
    //         const cmdt = await Asset.findOne({where: {id: asset.id}})
    //         const last_price_db = cmdt.price;
    //         const last_price_api = 1/asset.price;
    //         console.log(last_price_db );
    //         console.log(last_price_api);

            // if(last_price_db > last_price_api){
                // await cmdt.update({
                    // price: last_price_api,
                    // one_day_change: 
                // })
            // }else{
                // await cmdt.update({
                    // price: last_price_api,
                    // one_day_change: 
                // })

            // }
            // await cmdt.update({
            //     price
            // })
            // console.log(assetToUpdate.id, assetToUpdate.price);
    //     }
    // }

            // ------------------------------------------------------------------------------------------
}

exports.deleteAsset = async (req,res) => {
    const asset = await Asset.findByPk('JPY')
    await asset.destroy({force: true})
}