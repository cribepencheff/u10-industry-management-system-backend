import ProductModel from "../../models/product.js";

export const resolvers = {
  Query: {
    products: async (_parent, args) => {
      try {
        const products = await ProductModel.find();
        return products;
      } catch (error) {
        throw new Error("Error fetching products: " + error.message);
      }
    },
    product: async (_parent, { id }) => {
      try {
        const products = await ProductModel.find(id);
        return products;
      } catch (error) {
        throw new Error("Error fetching products: " + error.message);
      }
    },
  },
  Mutation: {
    addProduct: async (_parent, { input }) => {
      return ProductModel.create(input);
    },
  },
};
