import mongoose, { Schema } from "mongoose";

const ManufacturerSchema = new Schema (
  {
    name: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true
    },
    website: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true
    },
    contact: {
      type: Schema.Types.ObjectId, ref: "Contact",
      default: null,
      required: true,
    },
  },
  { timestamps: true }
);

export const ManufacturerModel = mongoose.model("Manufacturer", ManufacturerSchema);
