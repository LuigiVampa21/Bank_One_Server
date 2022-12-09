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
      // Usage of string and isIn for development pruproses : usage of sync alter: true ! think about change back after the dev processus
      type: DataTypes.STRING,
      // type: DataTypes.ENUM({
      //   values: ["checking", "savings", "investments"],
      // }),
      defaultValue: "pending",
      validate: {
        isIn: {
          args: [["pending", "confirmed"]],
          msg: "A loan must be either pending or confirmed",
        },
      },
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: {
          args: 300,
          msg: "We don't lend for more than 25years",
        },
        min: {
          args: 12,
          args: "The minimum loan is up to 1 year",
        },
      },
    },
    monthly_payment: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        max: {
          args: 500000,
          msg: "We ain't providing more than $500'000 by loan and by user",
        },
        min: {
          args: 1000,
          args: "Minimum loan is up to $1000",
        },
      },
    },
    verification_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    starting_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    paranoid: true,
  }
);

module.exports = BankAccount;
