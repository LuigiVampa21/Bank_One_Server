const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  // `${process.env.PSQL_POSTGRES}://${process.env.PSQL_USERNAME}:${process.env.PSQL_PASSWORD}@${process.env.PSQL_HOST}:${process.env.PSQL_PORT}/${process.env.PSQL_DATABASE_NAME}`
  'postgres://luigiv:qK3jrtrUpvylOgQyayOjrt3d9oq0Pyk0@dpg-cevu2marrk0eqcoehheg-a.frankfurt-postgres.render.com:5432/bank_one_zswa'
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
