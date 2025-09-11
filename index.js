require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use("/api/users", () => {
  console.log("Users route");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
