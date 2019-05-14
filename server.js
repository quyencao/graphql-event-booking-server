import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import bcrypt from "bcryptjs";

import models, { sequelize } from "./db";

const app = express();
const PORT = process.env.PORT || 5000;

const typeDefs = gql`
  type Event {
    id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: User!
  }

  input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  type User {
    id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
  }

  input UserInput {
    email: String!
    password: String!
  }

  type Query {
    events: [Event!]!
  }

  type Mutation {
    createEvent(event: EventInput!): Event!
    createUser(user: UserInput!): User!
  }
`;

const resolvers = {
  Query: {
    async events() {
      const events = await models.Event.findAll();
      return events.map(event => {
        return {
          ...event.dataValues,
          date: new Date(event.dataValues.date).toISOString()
        };
      });
    }
  },
  Mutation: {
    async createEvent(parent, { event }, context, info) {
      const user = await models.User.findByPk(1);

      const newEvent = await user.createEvent({
        title: event.title,
        description: event.description,
        price: event.price,
        date: event.date
      });

      return newEvent;
    },
    async createUser(parent, { user }, context, info) {
      try {
        const existUser = await models.User.findOne({
          where: { email: user.email }
        });

        if (existUser) {
          throw new Error("Email is adready exist.");
        }

        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(user.password, salt);

        const newUser = await models.User.create({
          email: user.email,
          password: hashPassword
        });

        return {
          ...newUser.dataValues,
          password: null
        };
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Event: {
    async creator(parent, args, context, info) {
      const user = await models.User.findOne({
        where: {
          id: parent.userId
        },
        attributes: {
          exclude: ["password"]
        }
      });

      return user;
    }
  },
  User: {
    async createdEvents(parent, args, context, info) {
      const events = await models.Event.findAll({
        where: { userId: parent.id }
      });

      return events.map(event => {
        return {
          ...event.dataValues,
          date: new Date(event.dataValues.date).toISOString()
        };
      });
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
