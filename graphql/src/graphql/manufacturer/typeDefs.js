export const typeDefs = /* GraphQL */ `
  type Manufacturer {
    id: ID!
    name: String!
    country: String!
    website: String
    description: String
    address: String
    contact: Contact!
    createdAt: String
    updatedAt: String
  }

  # Input type for creating/updating manufacturers
  input ManufacturerInput {
    name: String!
    country: String!
    website: String
    description: String
    address: String
    contact: String
  }

  type Query {
    manufacturers: [Manufacturer]
    manufacturer(id: ID!): Manufacturer
  }

  type Mutation {
    addManufacturer(input: ManufacturerInput!): Manufacturer
    updateManufacturer(id: ID!, input: ManufacturerInput!): Manufacturer
    deleteManufacturer(id: ID!): Boolean
  }
`;
