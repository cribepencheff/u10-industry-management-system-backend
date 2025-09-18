import mongoose, { Schema } from "mongoose";

const ContactSchema = new Schema (
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
    phone: { type: String },
  },
  { timestamps: true }
);

export const ContactModel = mongoose.model("Contact", ContactSchema);
