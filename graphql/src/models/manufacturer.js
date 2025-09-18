import mongoose from "mongoose";

const manufacturerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ManufacturerModel = mongoose.model("Manufacturer", manufacturerSchema);

export default ManufacturerModel;
