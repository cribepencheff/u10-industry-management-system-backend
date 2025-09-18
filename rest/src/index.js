import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { success, error } from "./utils/colors.js";

dotenv.config();
import productRoutes from "./routes/productRoutes.js";

const PORT = process.env.PORT || 3000;
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(success("✓"), `REST API is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(error("✓"), "DB connection error:", err.message);
    process.exit(1);
  });
