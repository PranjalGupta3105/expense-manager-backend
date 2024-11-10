const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");

const paymentSource = sequelize.define(
  "payment_sources",
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
    console.log("Payment Source table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

module.exports = paymentSource;
