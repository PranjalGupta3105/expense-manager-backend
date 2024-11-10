const { ApolloServer } = require("@apollo/server"); // 1 - Importing apollo server class
const { makeExecutableSchema } = require('@graphql-tools/schema');
const resolvers = require("../resolvers/index.js");
const typeDefs = require("../typeDefs/index.js");

const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers
  })

const apolloServerInstance = new ApolloServer({ schema: executableSchema });

module.exports = apolloServerInstance;
