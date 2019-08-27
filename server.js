import express from "express";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";

import models from "./models";
import typeDefs from "./graphql/schema";
import resolvers from "./graphql/resolvers";
import isAuth from "./middlewares/auth";

const app = express();
dotenv.config();
const port = process.env.PORT;
app.use(express.json()); // Express has its own body parser so no need 2 use d body-parser package
app.use(isAuth);

const schema = new ApolloServer({
  typeDefs,
  resolvers,
  playground: {
    endpoint: `/graphql`,
    subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`,
    settings: {
      "editor.theme": "light"
    }
  }
});

schema.applyMiddleware({ app });

// Wrap the Express server
const graphQLServer = createServer(app);

graphQLServer.listen(port, () => {
  console.log(`Server is Listening on Port ${port}`);
  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema
    },
    {
      server: graphQLServer,
      path: "/subscriptions"
    }
  );
});
