const { Sequelize } = require("sequelize");
const constants = require("../constants");

// Initialising a Sequelize Instance using the connection environment variables and initiating the connection
const sequelize = new Sequelize(
  constants.DATABASE_SERVER_CONFIG.DATABASE,
  constants.DATABASE_SERVER_CONFIG.USERNAME,
  constants.DATABASE_SERVER_CONFIG.PASSWORD,
  {
    host: constants.DATABASE_SERVER_CONFIG.HOST,
    dialect: constants.DATABASE_SERVER_CONFIG.DIALECT,
  }
);

// Passing the connection instance and checking the connection
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(`Database connected successfully`);
  } catch (error) {
    console.log(`Connection to the database is not successful`);
  }
}

testConnection();

module.exports = { sequelize };
