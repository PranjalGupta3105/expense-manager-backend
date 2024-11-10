const methodTypeDef = /* GraphQL*/ 
`
    type Method {
        id: Int!
        name: String!
        is_active: Int
    }

    type Query {
        method: [Method]
    }

    type Mutation {
        createNewPaymentMethod(name:String, is_active:Int): Method
        updatePaymentMethod(id: Int!, name:String): Method
        deletePaymentMethod(id: Int!): Method
    }
`

module.exports = methodTypeDef
