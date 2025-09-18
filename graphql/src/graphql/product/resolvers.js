import ProductModel from "../../models/product.js";

export const resolvers = {
  products: async (_parent, args) => {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (error) {
      throw new Error("Error fetching products: " + error.message);
    }
  },
};
