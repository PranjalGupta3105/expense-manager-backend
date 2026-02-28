// const { gql } = require('apollo-server-express');

const transactionCategoryTypeDefs = `
  type TransactionCategory {
    id: ID!
    name: String!
    is_active: Int!
    is_deleted: Int!
    created_by: Int!
    updated_by: Int!
    subCategories: [TransactionSubCategory]
  }

  type TransactionSubCategory {
    id: ID!
    name: String!
    is_active: Int!
    is_deleted: Int!
    created_by: Int!
    updated_by: Int!
    category_id: ID!
    category: TransactionCategory
  }

  type Query {
    getAllTransactionCategories: [TransactionCategory]
    getTransactionSubCategoriesByCategoryId(id: ID!): [TransactionSubCategory]
  }
`;

module.exports = transactionCategoryTypeDefs;
