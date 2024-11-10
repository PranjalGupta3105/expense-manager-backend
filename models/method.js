const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");

const paymentMethod = sequelize.define(
  "payment_methods",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
  },
  { timeStamps: false, underscored: true }
);

sequelize
  .sync()
  .then(() => {
    console.log("Payment Method table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

module.exports = paymentMethod;
