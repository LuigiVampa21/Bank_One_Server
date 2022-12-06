const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  `${process.env.PSQL_POSTGRES}://${process.env.PSQL_USERNAME}:${process.env.PSQL_PASSWORD}@${process.env.PSQL_HOST}:${process.env.PSQL_PORT}/${process.env.PSQL_DATABASE_NAME}`
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    require("../models");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { sequelize, connectDB };
