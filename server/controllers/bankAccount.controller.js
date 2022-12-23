const findAndSortTx = require('../utils/txsResolver');
const {StatusCodes} = require('http-status-codes');

exports.getTxsByAccount = async(req,res) => {
    let txs;
    const {type} = req.query;
    if(!type){
        txs = await findAndSortTx(req.user, 'allTxs')
    }else{
        txs = await findAndSortTx(req.user, 'allTxs', type)
    }
    res.status(StatusCodes.OK).json({
        results: txs.length,
        txs
    })
}