const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(
const sequelize = new Sequelize(

  // Branch Main activate this line
  // `${process.env.PSQL_POSTGRES}://${process.env.PSQL_USERNAME}:${process.env.PSQL_PASSWORD}@${process.env.PSQL_HOST}:${process.env.PSQL_PORT}/${process.env.PSQL_DATABASE_NAME}`

// Branch Render activate this line
    'postgres://luigivampa:LbP6nwGYQq0RE1GZxhS4rVUpWI8blSkS@dpg-cgel26g2qv2dpv9blg6g-a.frankfurt-postgres.render.com/bank_one_mqtz', {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
     }
   }
 }
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
