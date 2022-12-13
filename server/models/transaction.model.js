const { sequelize } = require("../config/connectDB");
const { DataTypes } = require("sequelize");
const zlib = require("zlib");
const CustomError = require("../errors");
const getBeneficiary = require('../utils/txBeneficiary')

const Transaction = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        isDecimal: {
          args: true,
          msg: "Amount must be a decimal number",
        },
        notIn: [[0.0]],
      },
    },

    // Commented for dev purposes, cause it takes to much space when requesteing on PSOtman think about to uncomment in prod THANK YOU

    // description: {
      // type: DataTypes.STRING,
    //   allowNull: false,
    //   validate: {
    //     len: [15, 100],
    //   },
    //   set(value) {
    //     const comrpessed = zlib.deflateSync(value).toString("base64");
    //     this.setDataValue("description", comrpessed);
    //   },
    //   get() {
    //     const value = this.getDataValue("description");
    //     const uncompressed = zlib.inflateSync(Buffer.from(value, "base64"));
    //     return uncompressed;
    //     return uncompressed.toString();
    //   },
    // },
    type: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [["internal", "external"]],
          msg: "Transaction must be either internal, or external",
        },
      },
    },
    status: {
      // Usage of string and isIn for development pruproses : usage of sync alter: true ! think about change back after the dev processus
      type: DataTypes.STRING,
      // type: DataTypes.ENUM({
      //   values: ["pending", "settled", "failed"],
      // }),
      defaultValue: "pending",
      validate: {
        isIn: {
          args: [["pending", "settled", "failed"]],
          msg: "Transaction must be either pending, settled or failed",
        },
      },
    },
    beneficiary: {
      type: DataTypes.STRING,
    },
    verification_token: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    inflow: {
      type: DataTypes.BOOLEAN,
    },
    beneficiary_name:{
      type: DataTypes.STRING,
    }

  },
  {
    paranoid: true,
  }
);

module.exports = Transaction;
