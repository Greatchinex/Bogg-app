import express from "express";
import dotenv from "dotenv";
import http from "http";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";

import "./models";
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
  context: ({ req, res, connection }) => {
    // Check for either a http request or a subscription
    if (connection) {
      return connection.context;
    } else {
      const logged_in_user = req.isAuth;
      const Id = req.userId;

      return {
        logged_in_user,
        Id
      }
    }
  }
});

schema.applyMiddleware({ app, path: '/graphql' });

// Wrap the Express server
const graphQLServer = http.createServer(app);
schema.installSubscriptionHandlers(graphQLServer);

graphQLServer.listen(port, () => {
  console.log(`🚀 Server is Listening on Port ${port}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${port}${schema.subscriptionsPath}`)
});
