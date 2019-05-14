import express from "express";
import { ApolloServer, gql } from "apollo-server-express";

import models, { sequelize } from "./db";

const app = express();
const PORT = process.env.PORT || 5000;

const events = [];

const typeDefs = gql`
  type Event {
    id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  type Query {
    events: [Event!]!
  }

  type Mutation {
    createEvent(event: EventInput!): Event!
  }
`;

const resolvers = {
  Query: {
    async events() {
      return await models.Event.findAll();
    }
  },
  Mutation: {
    async createEvent(parent, { event }, context, info) {
      const newEvent = await models.Event.create({
        title: event.title,
        description: event.description,
        price: event.price,
        date: event.date
      });

      return newEvent;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
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
