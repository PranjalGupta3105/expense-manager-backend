const dotenv = require("dotenv");
dotenv.config();

module.exports.SERVER_CONFIG = {
    PORT: process.env.PORT ? process.env.PORT : 3030
}

module.exports.DATABASE_SERVER_CONFIG = {
    DIALECT: process.env.DB_DIALECT ? process.env.DB_DIALECT : "postgres",
    HOST: process.env.DB_HOST ? process.env.DB_HOST : "localhost",
    PORT: process.env.DB_PORT ? process.env.DB_PORT : "5432",
    DATABASE: process.env.DB_NAME ? process.env.DB_NAME : "",
    USERNAME: process.env.DB_USERNAME ? process.env.DB_USERNAME : "",
    PASSWORD: process.env.DB_PASSWORD ? process.env.DB_PASSWORD : ""
}