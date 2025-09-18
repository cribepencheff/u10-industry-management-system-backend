import express from "express";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";

import { typeDefs } from "./graphql/index.js";
import { resolvers } from "./graphql/index.js";

dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use(
  "/graphql",
  expressMiddleware(server, {
    context: async ({ req }) => ({ user: req.user || null }),
  })
);

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "GQLDatabase",
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

// Start the application
const startServer = async () => {
  await connectDB();

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const PORT = parseInt(process.env.PORT || "3000", 10);
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/`);
  });
};

startServer();
