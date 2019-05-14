import bcrypt from "bcryptjs";

export default {
  User: {
    async createdEvents(parent, args, { models }, info) {
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
  Query: {},
  Mutation: {
    async createUser(parent, { user }, { models }, info) {
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
