import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Contact {
    id: ID!
    name: String!
    email: String!
    phone: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    contacts: [Contact]
    contact(id: ID!): Contact
  }

  type Mutation {
    addContact(
      name: String!
      email: String!
      phone: String
      createdAt: String
      updatedAt: String
    ): Contact
  }
`;
