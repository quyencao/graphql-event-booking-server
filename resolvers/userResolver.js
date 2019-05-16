import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default {
  User: {
    createdEvents: async (parent, args, { models }, info) => {
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
  },
  Query: {
    login: async (parent, { email, password }, { models, jwtSecret }, info) => {
      const user = await models.User.findOne({
        where: {
          email
        }
      });

      if (!user) {
        throw new Error("Email is not exist.");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new Error("Password is incorrect.");
      }

      const payload = {
        userId: user.id
      };

      const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

      return {
        email: user.email,
        token
      };
    }
  },
  Mutation: {
    createUser: async (parent, { user }, { models }, info) => {
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
  }
};
