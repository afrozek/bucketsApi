
export default `
type Account {
    incomeYearly: String!
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
