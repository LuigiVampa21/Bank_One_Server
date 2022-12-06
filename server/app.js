require("dotenv").config();
require("express-async-errors");

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const { sequelize, connectDB } = require("./config/connectDB");

const notFound = require("./middlewares/not-found");
const errorHandler = require("./middlewares/error-handler");

const app = express();

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

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT | 4040;
app.listen(PORT, async () => {
  console.log(`Server is listening on port: ${PORT}`);
  await connectDB();
});
