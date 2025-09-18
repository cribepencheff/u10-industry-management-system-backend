import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Manufacturer {
    id: ID!
    name: String!
    country: String!
    website: String
    description: String
    address: String
    contact: String
    createdAt: String
    updatedAt: String
  }

  type Query {
    manufacturers: [Manufacturer]
    manufacturer(id: ID!): Manufacturer
  }

  type Mutation {
    addManufacturer(
      name: String!
      country: String!
      website: String
      description: String
      address: String
      contact: String
      createdAt: String
      updatedAt: String
    ): Manufacturer
  }
`;
