export const typeDefs = /* GraphQL */`
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

  type TotalValueResult {
    totalValue: Float!
    message: String
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
    getProductsByCriticalStock: [Product!]!
  }

  type Mutation {
    addProduct(input: ProductInput!): Product
    updateProduct(id: ID!, input: ProductInput!): Product
    deleteProduct(id: ID!): Boolean
  }
`;
