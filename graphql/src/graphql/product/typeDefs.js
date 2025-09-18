import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    sku: String!
    description: String
    price: Float!
    category: String!
    manufacturer: String!
    amountInStock: Int!
    createdAt: String
    updatedAt: String
  }

  input ProductInput {
    name: String!
    sku: String!
    description: String
    price: Float!
    category: String!
    manufacturer: String!
    amountInStock: Int!
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
  }

  type Mutation {
    addProduct(input: ProductInput!): Product
    updateProduct(id: ID!, input: ProductInput!): Product
    deleteProduct(id: ID!): Boolean
  }
`;
