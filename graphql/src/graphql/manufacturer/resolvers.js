import { ManufacturerModel } from "../../models/Manufacturer.js";

export const resolvers = {
  Query: {
    manufacturers: async (_parent, args) => {
      try {
        const manufacturers = await ManufacturerModel.find();
        return manufacturers;
      } catch (error) {
        throw new Error("Error fetching products: " + error.message);
      }
    },
    manufacturer: async (_parent, { id }) => {
      try {
        const manufacturer = await ManufacturerModel.findById(id);
        return manufacturer;
      } catch (error) {
        throw new Error("Error fetching products: " + error.message);
      }
    },
  },
  Mutation: {
    addManufacturer: async (_parent, { input }) => {
      return ManufacturerModel.create(input);
    },
  },
};
