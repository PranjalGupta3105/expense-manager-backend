const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");

const TransactionCategory = sequelize.define('TransactionCategory', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_active: {
    type: DataTypes.SMALLINT,
    defaultValue: 0,
  },
  is_deleted: {
    type: DataTypes.SMALLINT,
    defaultValue: 0,
  },
  created_by: {
    type: DataTypes.BIGINT,
    defaultValue: 1,
  },
  updated_by: {
    type: DataTypes.BIGINT,
    defaultValue: 1,
  },
}, {
  tableName: 'transaction_categories',
  timestamps: false,
});

module.exports = TransactionCategory;
