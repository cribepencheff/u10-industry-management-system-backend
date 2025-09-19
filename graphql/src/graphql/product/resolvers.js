import { ProductModel } from "../../models/Product.js";

export const resolvers = {
  Query: {
    products: async (_parent) => {
      try {
        const products = await ProductModel.find();
        return products;
      } catch (error) {
        throw new Error("Error fetching products: " + error.message);
      }
    },
    product: async (_parent, { id }) => {
      try {
        const product = await ProductModel.findById(id);
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
        const products = await ProductModel.find({
          amountInStock: { $lt: 10 },
        });

        if (products.length === 0) {
          return "No low stock products";
        }

        return products;
      } catch (error) {
        throw new Error("Error fetching low stock products" + error.message);
      }
    },
    getProductsByCriticalStock: async (_parent, args) => {
      try {
        const products = await ProductModel.find({ amountInStock: { $lt: 5 } })
          .select("name sku amountInStock manufacturer")
          .populate({
            path: "manufacturer",
            select: "name contact -_id",
            populate: {
              path: "contact",
              select: "name phone email -_id"
            }
          });

        return products;
      } catch (error) {
        throw new Error("[products/critical-stock]" + error.message);
      }
    },
  },
  Mutation: {
    addProduct: async (_parent, { input }) => {
      return ProductModel.create(input);
    },
  },
};
