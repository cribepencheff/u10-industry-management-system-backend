import { typeDefs as contactTypeDefs } from "./contact/typeDefs.js";
import { resolvers as contactResolvers } from "./contact/resolvers.js";
import { typeDefs as manufacturerTypeDefs } from "./manufacturer/typeDefs.js";
import { resolvers as manufacturerResolvers } from "./manufacturer/resolvers.js";
import { typeDefs as productTypeDefs } from "./product/typeDefs.js";
import { resolvers as productResolvers } from "./product/resolvers.js";

export const typeDefs = [
  contactTypeDefs,
  manufacturerTypeDefs,
  productTypeDefs,
];
export const resolvers = [
  contactResolvers,
  manufacturerResolvers,
  productResolvers,
];
