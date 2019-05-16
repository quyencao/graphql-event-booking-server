import express from "express";
import { ApolloServer } from "apollo-server-express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

import typeDefs from "./types";
import resolvers from "./resolvers";

import models, { sequelize } from "./db";

const app = express();
const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    let currentUser = null;
    const authorizationHeader = req.headers["authorization"];

    try {
      const token = authorizationHeader.split(" ")[1];
      const { userId } = jwt.verify(token, process.env.JWT_SECRET);

      currentUser = await models.User.findByPk(userId);
    } catch (err) {
      console.warn(`Unable to authenticate using auth token`);
    }

    return {
      currentUser,
      models,
      jwtSecret: process.env.JWT_SECRET
    };
  }
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
