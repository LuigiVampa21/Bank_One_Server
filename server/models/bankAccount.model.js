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
      //   values: ["checking", "savings", "investments", "Bank One Ltd."],
      // }),
      validate: {
        isIn: {
          args: [["checking", "savings", "investments", "Bank One Ltd."]],
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
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
    },
    has_received_money_day: {
      type: DataTypes.BOOLEAN,
      defaultValue: null,
    }
  },
  {
    hooks: {
      afterDestroy: async account => {
        const cards = await account.getCards();
        cards.forEach(async card => {
          await card.update({
            is_active: false
          })
          await card.destroy()
        });
      },
    },
    paranoid: true,
  }
);

module.exports = BankAccount;
