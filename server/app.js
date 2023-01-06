require("dotenv").config();
require("express-async-errors");

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { connectDB } = require("./config/connectDB");
// const autoUpdateAssets = require('./utils/setAssetUpdatingTimer');
const socketFunctions = require('./webSocket/socket.function');

const notFound = require("./middlewares/not-found");
const errorHandler = require("./middlewares/error-handler");

const app = express();

const Server = require("socket.io").Server;
const http = require("http");


// const {createServer} = require("http");
// const  {Server} = require('socket.io');

const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const txRoute = require("./routes/transaction.route");
const loanRoute = require("./routes/loan.route");
const bankAccountRoute = require('./routes/bankAccount.route');
const cardRoute = require('./routes/card.route');
const assetRoute = require('./routes/asset.route')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const corsOptions = {
  origin: "*",
};

// app.use(morgan("dev"));
app.use(helmet());
app.use(cors(corsOptions));


const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8100",
    // credentials: true,
  },
  pingTimeout: 60000,
});




app.get("/", (req, res) => {
  res.send("Welcome to the official Bank One API");
});

app.use("/api/v1/bankone/auth", authRoute);
app.use("/api/v1/bankone/users", userRoute);
app.use("/api/v1/bankone/transactions", txRoute);
app.use("/api/v1/bankone/loans", loanRoute);
app.use("/api/v1/bankone/cards", cardRoute);
app.use('/api/v1/bankone/assets', assetRoute);
app.use("/api/v1/bankone/bank-accounts", bankAccountRoute);

// app.use("/api/v1/cards/bacardRoute-accounts", bankAccountRoute);


// THOSE Routes are not-client-guided they will be called programmtically through a pre-defined interval except for dev TESTING
// OR CREATING ASSETS => routes starts with admin
const stocksRoute = require('./trading-routes/stocks.route')
const fxcmdtsRoute = require('./trading-routes/commodittiesForex.route')
app.use('/api/v1/bankone/admin/stocks', stocksRoute)
app.use('/api/v1/bankone/admin/fxcmdts', fxcmdtsRoute)


// MASTER BANK ACCOUNT PRIVATE
const bkmRoute = require("./routes/_bankAccountMaster.route");
app.use("/api/v1/bankone/bank-account-master", bkmRoute);

app.use(notFound);
app.use(errorHandler);

// io.on('connection', socket => {
//   console.log('------------------------------------------------------------------------------------------');
//   console.log(socket.id);
//   // socketFunctions(io, socket);
// });



// console.log(io);

// const createCryptoAsset = require('./trading-routes/crypto.route')
// const fxcmdtController = require('./trading-controllers/commodittiesForex.controller')

const PORT = process.env.PORT | 4040;
httpServer.listen(PORT, async () => {
  console.log(`Server is listening on port: ${PORT}`);

  // UNCOMMENT WHEN READY FOR PRODUCTION
  // this file needs to be required after initiating the io instance otherwise we won't be able to acces it to emit event cause it will be empty 

  io.on('connection', socket => {
    console.log('------------------------------------------------------------------------------------------');
    console.log(socket.id);
    // socketFunctions(io, socket);
    require('./utils/setAssetUpdatingTimer')(io);
  });


  // TEST
  // await require('./trading-controllers/crypto.controller').updateCryptoPrice()
  // await require('./trading-controllers/commodittiesForex.controller').updateCmdtsForexPrice()
  // await require('./trading-controllers/stocks.controller').updateStockPrice()

  await connectDB();

  // fxcmdtController.deleteAsset()

  // CREATE CRYPTO ASSET
  // await createCryptoAsset()
  
});

module.exports = io;
