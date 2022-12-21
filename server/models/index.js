const { sequelize } = require("../config/connectDB");
const User = require("./user.model");
const BankAccount = require("./bankAccount.model");
const Transaction = require("./transaction.model");
const Loan = require("./loan.model");
const Card = require('./card.model');
const Asset = require('./asset.model')

User.hasMany(BankAccount, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

BankAccount.belongsTo(User, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

BankAccount.hasMany(Transaction, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Transaction.belongsTo(BankAccount, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

BankAccount.hasMany(Loan, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Loan.belongsTo(BankAccount, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// One bankAccount can have multiple cards but one card belongs to only one Bank Account
// At The creation of a bank Account we initiate a Digital Card and the user will then be able to apply for a physical one
BankAccount.hasMany(Card, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Card.belongsTo(BankAccount, {
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});



(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    // await sequelize.sync({ alter: true });
    // await sequelize.sync({ force: true });
    // await sequelize.sync();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
