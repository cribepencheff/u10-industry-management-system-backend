require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use("/api/product", productRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
