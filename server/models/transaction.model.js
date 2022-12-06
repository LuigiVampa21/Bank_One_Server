const { sequelize } = require("../config/connectDB");
const { DataTypes } = require("sequelize");
const zlib = require("zlib");
// const bcrypt = require("bcryptjs");
const CustomError = require("../errors");

const Transaction = sequelize.define("Transaction", {
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
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [15, 100],
    },
    set(value) {
      const comrpessed = zlib.deflateSync(value).toString("base64");
      this.setDataValue("description", comrpessed);
    },
    get() {
      const value = this.getDataValue("description");
      const uncompressed = zlib.inflateSync(Buffer.from(value, "base64"));
      return uncompressed;
    },
  },
  status: {
    type: DataTypes.ENUM({
      values: ["pending", "settled", "failed"],
    }),
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
});

module.exports = Transaction;