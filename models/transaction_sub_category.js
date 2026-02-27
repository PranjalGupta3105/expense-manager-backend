const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");
const TransactionCategory = require('./transaction_category');

const TransactionSubCategory = sequelize.define('TransactionSubCategory', {
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
  category_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: TransactionCategory,
      key: 'id',
    },
  },
}, {
  tableName: 'transaction_sub_categories',
  timestamps: false,
});

TransactionSubCategory.belongsTo(TransactionCategory, { foreignKey: 'category_id' });
TransactionCategory.hasMany(TransactionSubCategory, { foreignKey: 'category_id', as: 'subCategories' });

module.exports = TransactionSubCategory;
