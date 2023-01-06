const Asset = require('../models/asset.model');
const {StatusCodes} = require('http-status-codes');
const axios = require('axios');
const percentage = require('calculate-percentages');
// const result = require('../data/stocksData')


exports.createStockAsset = async(req,res) => {
    const { id, name, type, image, price, last_closing_price } = req.body;
    const one_day_change = percentage.differenceBetween(last_closing_price, price);
    const asset = await Asset.create({ id, name, type, image, price, one_day_change });
    res.status(StatusCodes.OK).json({
        asset
    })   
}

exports.updateStockPrice = async() => {

    const currentHour = new Date().getHours();

    if(!(currentHour >= 15.5 && currentHour < 22.5)) return;

// if (currentHour >= 15.5 && currentHour < 22.5) {
    let stocksDataFromAPI = [];
    
    const response = await axios.get(process.env.STOCKS_UPDATE_URL);
    const {result} = response.data.quoteResponse
    
    for (const r of result){
            const obj = {id: r.symbol, price: r.regularMarketPrice, one_day_change: r.regularMarketChangePercent}
            stocksDataFromAPI = [...stocksDataFromAPI, obj]
    }

    for(const stock_api of stocksDataFromAPI){
        const stock = await Asset.findByPk(stock_api.id);
        await stock.update({
            price: stock_api.price,
            one_day_change: stock_api.one_day_change,
            last_update: new Date()
        })
        await stock.save()
        // console.log(stock.toJSON());
    }
// }
}
