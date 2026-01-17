const { sequelize } = require("../config/database");
const paymentSource = require("./source");
const { DataTypes } = require("sequelize");

const paymentCards = sequelize.define(
  "payment_cards",
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
    method_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "payment_methods",
          key: "id"
        }
    },
    is_active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    source_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "payment_sources",
          key: "id"
        }
    },
    statement_date: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    renewal_date: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    renewal_mon: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    renewable: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    renewal_amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0.0
    },
    fee_waiver_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
  },
  { timeStamps: false, underscored: true }
);

sequelize
  .sync()
  .then(() => {
    console.log("Payment Cards table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table : ", error);
  });

paymentCards.belongsTo(paymentSource, {
  foreignKey: 'source_id',
  as: 'payment_source'
});

module.exports = paymentCards;
