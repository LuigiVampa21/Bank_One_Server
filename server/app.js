require("dotenv").config();
require("express-async-errors");

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const { connectDB } = require("./config/connectDB");
const path = require('path')

const notFound = require("./middlewares/not-found");
const errorHandler = require("./middlewares/error-handler");

const app = express();

const Server = require("socket.io").Server;
const http = require("http");

const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const txRoute = require("./routes/transaction.route");
const loanRoute = require("./routes/loan.route");
const bankAccountRoute = require('./routes/bankAccount.route');
const cardRoute = require('./routes/card.route');
const assetRoute = require('./routes/asset.route')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(morgan("dev"));

const corsOptions = {
  origin: "*",
  // origin: "bank-one-android.vercel.app",
};

// Branch Main activate this line 
app.use(helmet());
app.use(cors(corsOptions));

const limiter = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/apibankone/auth/login', limiter);

app.use(xss());


// Branch Render activate this line
// app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
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


// THOSE Routes are not-client-guided they will be called programmtically
//  through a pre-defined interval except for dev TESTING
const stocksRoute = require('./trading-routes/stocks.route')
const fxcmdtsRoute = require('./trading-routes/commodittiesForex.route')
app.use('/api/v1/bankone/admin/stocks', stocksRoute)
app.use('/api/v1/bankone/admin/fxcmdts', fxcmdtsRoute)


// MASTER BANK ACCOUNT PRIVATE
const bkmRoute = require("./routes/_bankAccountMaster.route");
app.use("/api/v1/bankone/bank-account-master", bkmRoute);

app.use(notFound);
app.use(errorHandler);

// const createCryptoAsset = require('./trading-routes/crypto.route')
// const fxcmdtController = require('./trading-controllers/commodittiesForex.controller')

const PORT = process.env.PORT | 4040;
// const checkDate = require('./utils/moneyDay/checkDate')
httpServer.listen(PORT, async () => {
  console.log(`Server is listening on port: ${PORT}`);

  io.on('connection', socket => {
    console.log(socket.id);
    // socketFunctions(io, socket);
  });
  // require('./utils/setAssetUpdatingTimer')(io);
  
  await connectDB();
  // await checkDate()
  
});

module.exports = io;

  // TEST
  // await require('./trading-controllers/crypto.controller').updateCryptoPrice()
  // await require('./trading-controllers/commodittiesForex.controller').updateCmdtsForexPrice()
  // await require('./trading-controllers/stocks.controller').updateStockPrice()
  

  // require('./utils/moneyDay/moneyDay')

  // fxcmdtController.deleteAsset()

  // CREATE CRYPTO ASSET
  // await createCryptoAsset()
  

