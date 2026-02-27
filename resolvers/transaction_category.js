const { getAllTransactionCategories, getTransactionSubCategoriesByCategoryId } = require('../services/transaction_category');

const TransactionSubCategory = require('../models/transaction_sub_category');
const transactionCategoryResolvers = {
  Query: {
    getAllTransactionCategories: async () => {
      return await getAllTransactionCategories();
    },
    getTransactionSubCategoriesByCategoryId: async (_, { id }) => {
      return await getTransactionSubCategoriesByCategoryId(id);
    },
  },
  TransactionCategory: {
    subCategories: async (parent) => {
      return await TransactionSubCategory.findAll({
        where: { category_id: parent.id },
      });
    },
  },
  TransactionSubCategory: {
    category: async (parent) => {
      return await TransactionCategory.findByPk(parent.category_id);
    },
  },
};

module.exports = transactionCategoryResolvers;
