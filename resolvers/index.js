const path = require('path')
const { mergeResolvers } = require('@graphql-tools/merge')
const { loadFilesSync } = require('@graphql-tools/load-files')
 
const resolversArray = loadFilesSync(path.join(__dirname, '../resolvers'), { extensions: ['js'], ignoreIndex: true  })
const resolvers = mergeResolvers(resolversArray)
module.exports = resolvers