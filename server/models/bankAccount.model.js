const { sequelize } = require("../config/connectDB");
const { DataTypes } = require("sequelize");
// const CustomError = require("../errors");

const BankAccount = sequelize.define(
  "BankAccount",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    type: {
      // type: DataTypes.STRING,
      type: DataTypes.ENUM({
        values: ["checking", "savings", "investments"],
      }),
      validate: {
        isIn: {
          args: [["checking", "savings", "investments"]],
          msg: "Account must be either checking, savings or investments",
        },
      },
    },
    iban: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    current_amount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
  },
  {
    paranoid: true,
  }
);

module.exports = BankAccount;
