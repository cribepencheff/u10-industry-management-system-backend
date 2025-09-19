import { success } from "../utils/color.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  const CLUSTER_NAME = process.env.CLUSTER_NAME;
  const DB_NAME = process.env.DB_NAME;

  if (!MONGODB_URI) throw new Error("MONGODB_URI not found in .env");
  if (!DB_NAME) throw new Error("DB_NAME not found in .env");

  await mongoose.connect(MONGODB_URI, {
    dbName: DB_NAME,
    appName: CLUSTER_NAME,
  });

  if (!mongoose.connection.db) {
    throw new Error("MongoDB connection not initialized");
  }
  await mongoose.connection.db.admin().ping();
  console.log(success("✓"), "MongoDB connected and responding");
};
