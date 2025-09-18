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

  # Input type for creating/updating contacts
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
