import mongoose, { Schema } from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: Schema.Types.ObjectId, ref: "Manufacturer",
      default: null,
      required: true,
    },
    amountInStock: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ProductModel = mongoose.model("Product", ProductSchema);
