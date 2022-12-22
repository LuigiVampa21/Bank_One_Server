require("dotenv").config();
require("express-async-errors");

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { connectDB } = require("./config/connectDB");

const notFound = require("./middlewares/not-found");
const errorHandler = require("./middlewares/error-handler");

const app = express();

const authRoute = require("./routes/auth.route");
const userRoute = require("./routes/user.route");
const txRoute = require("./routes/transaction.route");
const loanRoute = require("./routes/loan.route");
// const bankAccountRoute = require('./routes/bankAccount.route');
const cardRoute = require('./routes/card.route');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const corsOptions = {
  origin: "*",
};
app.use(morgan("dev"));
app.use(helmet());
app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Welcome to the official Bank One API");
});

app.use("/api/v1/bankone/auth", authRoute);
app.use("/api/v1/bankone/users", userRoute);
app.use("/api/v1/bankone/transactions", txRoute);
app.use("/api/v1/bankone/loans", loanRoute);
app.use("/api/v1/bankone/cards", cardRoute);
// app.use('/api/v1/bankone/tradings')

// app.use("/api/v1/bankone/bank-accounts", bankAccountRoute);
// app.use("/api/v1/cards/bacardRoute-accounts", bankAccountRoute);

// THOSE Routes are not-client-guided they will be called programmtically through a pre-defined interval except for dev TESTING
// OR CREATING ASSETS

const stocksRoute = require('./trading-routes/stocks.route')
app.use('/api/v1/bankone/stocks', stocksRoute)



// MASTER BANK ACCOUNT PRIVATE
const bkmRoute = require("./routes/_bankAccountMaster.route");
app.use("/api/v1/bankone/bank-account-master", bkmRoute);

app.use(notFound);
app.use(errorHandler);

// const createCryptoAsset = require('./trading-routes/crypto.route')

const PORT = process.env.PORT | 4040;
app.listen(PORT, async () => {
  console.log(`Server is listening on port: ${PORT}`);

  await connectDB();

  // CREATA CRYPTO ASSET
  // await createCryptoAsset()

  // setInterval(() => {
  //   UPDATE PRICE OF ASSETS
  // }, 600000)
  
});
