const mongoose = require("mongoose");

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  const CLUSTER_NAME = process.env.CLUSTER_NAME;
  const DB_NAME = process.env.DB_NAME;

  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME, appName: CLUSTER_NAME });
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
