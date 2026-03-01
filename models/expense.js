const { sequelize } = require("../config/database")
const { DataTypes } = require("sequelize");
const paymentCards = require("./cards");

const Expense = sequelize.define(
  "expenses",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    source_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    method_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_repayed: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sub_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    card_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: "payment_cards",
        key: "id",
      },
    },
  },
  { timeStamps: false, underscored: true },
);

sequelize
  .sync()
  .then(() => {
    console.log("expenses table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

Expense.hasOne(paymentCards, {
  sourceKey: 'card_id',
  foreignKey: 'id',
  as: 'payment_cards'
});


module.exports = Expense;