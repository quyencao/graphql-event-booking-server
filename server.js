import express from "express";
import { ApolloServer } from "apollo-server-express";

import typeDefs from "./types";
import resolvers from "./resolvers";

import models, { sequelize } from "./db";

const app = express();
const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async () => ({
    models
  })
});

server.applyMiddleware({ app });

sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  })
  .catch(error => console.log(error));
