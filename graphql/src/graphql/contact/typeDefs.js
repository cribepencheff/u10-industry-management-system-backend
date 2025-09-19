export const typeDefs = /* GraphQL */ `
  type Contact {
    id: ID!
    name: String!
    email: String!
    phone: String
    createdAt: String
    updatedAt: String
  }
  input ContactInput {
    name: String!
    email: String!
    phone: String
  }

  type Query {
    contacts: [Contact]
    contact(id: ID!): Contact
  }

  type Mutation {
    addContact(input: ContactInput!): Contact
    updateContact(id: ID!, input: ContactInput!): Contact
    deleteContact(id: ID!): Boolean
  }
`;
