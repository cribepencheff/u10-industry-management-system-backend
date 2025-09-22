import express from "express";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express4";
import { connectDB } from "./config/db.js";
import { success, error, underline } from "./utils/colors.js";
import { typeDefs } from "./graphql/index.js";
import { resolvers } from "./graphql/index.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();

app.use(
	"/graphql",
	expressMiddleware(server, {
		context: async () => ({}),
	})
);

connectDB()
  .then(() => {
      app.listen(PORT, () => {
        console.log(success("✓"), `GraphQL is running on port ${PORT}`);
        console.log(success("✓"), `Apollo Sandbox running on ${underline("http://localhost:" + PORT + "/graphql")}`);
      });
    })
    .catch((err) => {
      console.error(error("✓"), "DB connection error:", err.message);
      process.exit(1);
    });
