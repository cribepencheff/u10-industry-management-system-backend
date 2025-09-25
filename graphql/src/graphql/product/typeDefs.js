export const typeDefs = /* GraphQL */ `
  type Product {
    id: ID!
    name: String!
    sku: String!
    description: String
    price: Float!
    category: String!
    manufacturer: Manufacturer!
    amountInStock: Int!
    createdAt: String
    updatedAt: String
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

  # Input type for updating a product (all fields optional!)
  input ProductUpdateInput {
    name: String
    sku: String
    description: String
    price: Float
    category: String
    manufacturer: String
    amountInStock: Int
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
    totalStockValue: Float!
    totalStockValueByManufacturer: [ManufacturerTotalValue!]
    lowStockProducts: [Product!]
    criticalStockProducts: [Product!]!
  }

  type Mutation {
    addProduct(input: ProductInput!): Product
    updateProduct(id: ID!, input: ProductUpdateInput!): Product
    deleteProduct(id: ID!): Boolean
  }
`;
