const mongoose = require("mongoose");

const ManufacturerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      unique: true,
    },
    website: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    adress: {
      type: String,
      required: true,
      unique: true,
    },
    contact: {
      type: Schema.Types.ObjectId, ref: "Contact",
      default: null,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Manufacturer", ManufacturerSchema);
