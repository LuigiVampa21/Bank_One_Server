const { sequelize } = require("../config/connectDB");
const { DataTypes } = require("sequelize");

const Asset = sequelize.define(
  "Asset",
  {
    id: {
      type: DataTypes.STRING,
    //   defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
      isAlpha: true,
      isLowercase: true,
      len: [3,4]
    },
    name:{
        type: DataTypes.STRING,
        defaultValue: false,
        isAlpha: true,
        isLowercase: true,
    },
    type: {
      // Usage of string and isIn for development pruproses : usage of sync alter: true ! think about change back after the dev processus
      type: DataTypes.STRING,
      // type: DataTypes.ENUM({
      //   values: ["checking", "savings", "investments", "Bank One Ltd."],
      // }),
      validate: {
        isIn: {
          args: [["stock", "crypto", "commodity"]],
          msg: "We only trade stocks, cryptos and commoditties over here",
        },
      },
    },
    image: {
        type: DataTypes.STRING,
        defaultValue: false,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    last_update: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    one_day_change: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
  },
  {
    paranoid: true,
  }
);

module.exports = Asset;
