import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
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
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: Schema.Types.ObjectId,
      ref: "Manufacturer",
      default: null,
      required: true,
    },
    amountInStock: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const ProductModel = mongoose.model("Product", ProductSchema);
