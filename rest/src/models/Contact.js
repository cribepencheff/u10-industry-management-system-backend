import mongoose, { Schema } from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    // TODO: Should number be required?
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ContactModel = mongoose.model("Contact", ContactSchema);
