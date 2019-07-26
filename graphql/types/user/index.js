
export default `
type Transaction {
    name: String
    amount: Float
}

type Account {
    incomeYearly: String!
    transactions: [Transaction]
}

  type User {
    _id: String!
    email: String!
    account: [Account]
  }
  type Query {
    user(_id: ID!): User!
    users: [User!]!
  }
`;
