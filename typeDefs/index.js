const path = require("path")
const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');

const loadedFiles = loadFilesSync(path.join(__dirname, '../typeDefs'), { extensions: ['js'], ignoreIndex: true });
const typeDefs = mergeTypeDefs(loadedFiles)

module.exports = typeDefs;