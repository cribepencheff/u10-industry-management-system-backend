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
            populate: { path: "contact" }
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

      try {
        const existingManufacturer = await ManufacturerModel.findById(manufacturer);
        if (!existingManufacturer) {
          throw new Error("Manufacturer does not exist");
        }

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
          throw new Error(`A product with SKU "${sku}" already exists.`);
        }

        throw new Error("Error creating product");
      }
    },
  }
};
