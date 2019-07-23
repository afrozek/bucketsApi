export default `
  type User {
    _id: String!
    email: String!
  }
  type Query {
    user(_id: ID!): User!
    users: [User!]!
  }
`;
