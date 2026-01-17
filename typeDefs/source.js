const sourceTypeDef = /*GraphQL*/
`
    type Query {
      sources: [Source]
      ccSources: [CCSource]
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
    
    type CCSource {
      id: Int!
      card_name: String
      source_id: Int
      issuing_bank: String
      method_id: Int
    }
`;

module.exports = sourceTypeDef