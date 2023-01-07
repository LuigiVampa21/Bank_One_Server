const { sequelize } = require("../config/connectDB");
const { DataTypes } = require("sequelize");
// const CustomError = require("../errors");

const Loan = sequelize.define(
  "Loan",
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
        max: 300,
        min: 12,
      },
    },
    month_left: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: 300,
      },
    },
    monthly_payment: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    rate: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        max: 500000,
        min: 1000,
      },
    },
    verification_token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    starting_date: {
      type: DataTypes.DATEONLY,
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

module.exports = Loan;
