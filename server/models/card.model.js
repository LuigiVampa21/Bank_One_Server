const { sequelize } = require("../config/connectDB");
const { DataTypes } = require("sequelize");

const Card = sequelize.define(
  "Card",
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
      //   args: [["digital", "physical"]],
      // }),
      validate: {
        isIn: {
          args: [["digital", "physical"]],
          msg: "A card must either be digital or physical",
        },
      },
    },
    card_numbers: {
        type: DataTypes.BIGINT,
        allowNull: false,
        isCreditCard: true,
        len: [16, 16],
    },
    placeholder: {
        type: DataTypes.STRING,
        // isAlphanumeric: true,
        isUppercase: true,
        len: [1, 50],
    },
    cvc: {
        type: DataTypes.INTEGER,
        len: [3, 3],
        allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    insurance: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    expiration_date: {
      type: DataTypes.STRING,
      isDate: true,
    //   Replace by function after + ADD ISAfter
      allowNull: false,
    },
    insurance_token: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    activation_token: {
      type: DataTypes.STRING,
      defaultValue: null
    }
  },
  {
    paranoid: true,
  }
);

module.exports = Card;