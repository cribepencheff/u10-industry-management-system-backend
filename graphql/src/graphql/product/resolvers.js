import { ProductModel } from "../../models/Product.js";

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
  },
  Mutation: {
    addProduct: async (_parent, { input }) => {
      return ProductModel.create(input);
    },
  },
};
