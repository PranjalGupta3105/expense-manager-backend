const usersTypeDef = /* GraphQL */
`
    type User {
        id: Int!
        first_name: String
        last_name: String
        username: String!
        password: String!
        country_code: String
        phone: String
        pfp: String
        role_id: Int
    }
    
    type Query {
        users: [User]
        user: User
    }
    
    type Mutation {
        newUser(input: createUserInput!): User
    }

    input createUserInput {
     first_name: String, 
     last_name: String, 
     username: String!, 
     password: String!, 
     country_code: String, 
     phone: String, 
     pfp: String
    }
`;

module.exports = usersTypeDef