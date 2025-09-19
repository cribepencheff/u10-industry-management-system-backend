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

  type TotalValueResult {
    totalValue: Float!
    message: String
  }

  type CriticalStockProduct {
    name: String!
    sku: String!
    amountInStock: Int!
    manufacturer: String!
    contactName: String!
    phone: String
    email: String
  }

  type ManufacturerTotalValue {
    manufacturer: String!
    totalValue: Float!
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
    getTotalValueOfAllProducts: Float!
    getTotalValueByManufacturer: [ManufacturerTotalValue!]
    getLowStockProducts: [Product!]
    getProductsByCriticalStock: [CriticalStockProduct!]
  }

  type Mutation {
    addProduct(input: ProductInput!): Product
    updateProduct(id: ID!, input: ProductInput!): Product
    deleteProduct(id: ID!): Boolean
  }
`;
