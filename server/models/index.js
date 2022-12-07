const { sequelize } = require("../config/connectDB");
const User = require("./user.model");
const BankAccount = require("./bankAccount.model");
const Transaction = require("./transaction.model");

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

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    // await sequelize.sync({ force: true });
    // await sequelize.sync({ alter: true });
    // await sequelize.sync();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
