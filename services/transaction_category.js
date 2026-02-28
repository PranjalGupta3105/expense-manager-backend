const TransactionCategory = require('../models/transaction_category');
const TransactionSubCategory = require('../models/transaction_sub_category');

async function getAllTransactionCategories() {
  return await TransactionCategory.findAll({
    include: [{ model: TransactionSubCategory, as: 'subCategories' }],
  });
}

async function getTransactionSubCategoriesByCategoryId(categoryId) {
  return await TransactionSubCategory.findAll({
    where: { category_id: categoryId },
  });
}

module.exports = {
  getAllTransactionCategories,
  getTransactionSubCategoriesByCategoryId,
};
