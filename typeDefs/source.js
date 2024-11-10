const sourceTypeDef = /*GraphQL*/
`
    type Query {
      sources: [Source]
    }

    type Source {
      id: Int!
      name: String
      is_active: Int
    }

    type Mutation {
      newSource(name: String): Source
      deleteSource(id: Int!): Source
      updateSource(id: Int!, name: String): Source
    }
`

module.exports = sourceTypeDef