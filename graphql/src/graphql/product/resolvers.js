import mongoose from "mongoose";
import { ProductModel } from "../../models/product.js";
import { ManufacturerModel } from "../../models/manufacturer.js";

export const resolvers = {
  Query: {
    products: async (_parent) => {
      try {
        const products = await ProductModel.find()
          .populate({ path: "manufacturer", populate: { path: "contact"} });

        return products;
      } catch (error) {
        throw new Error("Error fetching products: " + error.message);
      }
    },
    product: async (_parent, { id }) => {
      try {
        const product = await ProductModel.findById(id)
          .populate({ path: "manufacturer", populate: { path: "contact"} });
        return product;
      } catch (error) {
        throw new Error("Error fetching products: " + error.message);
      }
    },
    getTotalValueOfAllProducts: async (_parent, args) => {
      try {
        const result = await ProductModel.aggregate([
          {
            $group: {
              _id: null,
              totalValue: {
                $sum: { $multiply: ["$price", "$amountInStock"] },
              },
            },
          },
        ]);

        if (result.length === 0) {
          return 0;
        }

        const value = Number(result[0]?.totalValue.toFixed(2));
        return value;
      } catch (error) {
        throw new Error(
          "Error calculating total value of products" + error.message
        );
      }
    },
    getTotalValueByManufacturer: async (_parent, args) => {
      try {
        const result = await ProductModel.aggregate([
          {
            $lookup: {
              from: "manufacturers",
              localField: "manufacturer",
              foreignField: "_id",
              as: "manufacturerData",
            },
          },
          {
            $unwind: "$manufacturerData",
          },
          {
            $group: {
              _id: "$manufacturerData.name",
              totalValue: {
                $sum: {
                  $multiply: ["$price", "$amountInStock"],
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              manufacturer: "$_id",
              totalValue: 1,
            },
          },
        ]);

        if (result.length === 0) {
          return [];
        }

        const formattedResult = result.map((item) => ({
          manufacturer: item.manufacturer,
          totalValue: Number(item.totalValue.toFixed(2)),
        }));

        return formattedResult;
      } catch (error) {
        throw new Error(
          "Error calculating total value by manufacturer" + error.message
        );
      }
    },
    getLowStockProducts: async (_parent, args) => {
      try {
        const products = await ProductModel.find({ amountInStock: { $lt: 10 } }).populate({
          path: "manufacturer",
          populate: { path: "contact" }
        });

        return products;
      } catch (error) {
        throw new Error("Error fetching low stock products" + error.message);
      }
    },
    getProductsByCriticalStock: async (_parent, args) => {
      try {
        const products = await ProductModel.find({ amountInStock: { $lt: 5 } })
          .populate({
            path: "manufacturer",
            select: "name contact",
            populate: {
              path: "contact",
              select: "name phone email" }
          });

        return products;
      } catch (error) {
        throw new Error("[products/critical-stock]" + error.message);
      }
    },
  },
  Mutation: {
    addProduct: async (_parent, { input }) => {
      const { name, sku, description, price, category, manufacturer, amountInStock } = input;

      if (!name || !sku || !description || !price || !category || !manufacturer || !amountInStock) {
        throw new Error(`All fields are required: ${Object.values(input).join(", ")}`);
      }

      if (!mongoose.isValidObjectId(manufacturer)) {
        throw new Error("Manufacturer ID must be a valid ObjectID");
      }

      const existingManufacturer = await ManufacturerModel.findById(manufacturer);
      if (!existingManufacturer) {
        throw new Error("Manufacturer does not exist");
      }

      try {
        const newProduct = await ProductModel.create({
          name,
          sku,
          description,
          price,
          category,
          manufacturer,
          amountInStock,
        });

        await newProduct.populate("manufacturer");
        return newProduct;

      } catch (error) {
        if (error.code === 11000) {
          throw new Error(`A product with SKU ${sku} already exists.`);
        }

        throw new Error(`Error creating product: ${error.message}`);
      }
    },
    updateProduct: async (_parent, { id, input }) => {
      const allowedFields = ["name", "sku", "description", "price", "category", "manufacturer", "amountInStock"];
      const validInputs = {};

      allowedFields.forEach(field => {
        if (field in input) validInputs[field] = input[field];
      });

      if (!Object.keys(validInputs).length) {
        return res.status(400).json({ error: `At least one of the following fields must be provided: ${allowedFields.join(", ")}` });
      }

      if (!mongoose.isValidObjectId(id)) {
        throw new Error("Product ID must be valid ObjectID");
      }

      if ("manufacturer" in validInputs) {
        if (!mongoose.isValidObjectId(validInputs.manufacturer)) {
          throw new Error("Manufacturer ID must be a valid ObjectID");
        }

        const existingManufacturer = await ManufacturerModel.findById(validInputs.manufacturer);
        if (!existingManufacturer) throw new Error("Manufacturer does not exist");
      }

      try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(
          id,
          validInputs,
          { new: true, runValidators: true }
        );

        if (!updatedProduct) {
          throw new Error("Product not found");
        }

        return updatedProduct;

      } catch (error) {
        if (error.code === 11000) {
          throw new Error(`A product with SKU "${validInputs.sku}" already exists.`);
        }
        throw new Error(`Error creating product: ${error.message}`);
      }
    },
  },

  // Resolvers ensure MongoDB ObjectIds are returned as strings in GraphQL schema.
  Product: {
    id: (doc) => String(doc._id),

    manufacturer: async (doc) => {
      // For manufacturer: return full object if already populated, otherwise return just its id.
      if (doc.manufacturer && typeof doc.manufacturer === "object" && doc.manufacturer._id) {
        return doc.manufacturer;
      }

      return { id: String(doc.manufacturer) };
    },
  },

  Manufacturer: {
    id: (doc) => String(doc._id),
  },
};
