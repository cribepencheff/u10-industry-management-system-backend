import express from "express";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import { typeDefs } from "./graphql/index.js";
import { resolvers } from "./graphql/index.js";

dotenv.config();

const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => ({ user: req.user || null }), // Move context here
});
await server.start();
server.applyMiddleware({ app, path: "/graphql" });

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Rest is running on port 3000");
    });
  })
  .catch(console.error);
