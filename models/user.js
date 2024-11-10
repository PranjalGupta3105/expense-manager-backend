const { sequelize } = require("../config/database")
const { DataTypes } = require("sequelize");

const User = sequelize.define(
  "app_users",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    pfp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 2
    }
  },
  { timeStamps: false, underscored: true }
);

sequelize
  .sync()
  .then(() => {
    console.log("users table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

module.exports = User;