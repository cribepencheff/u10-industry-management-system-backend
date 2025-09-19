import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { success, error } from "./utils/colors.js";
import contactRoutes from "./routes/contactRoutes.js";
import manufacturerRoutes from "./routes/manufacturerRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use("/api/contact", contactRoutes);
app.use("/api/manufacturer", manufacturerRoutes);
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
