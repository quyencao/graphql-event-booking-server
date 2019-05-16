import authGuard from "../guards/authGuard";

export default {
  Event: {
    creator: async (parent, args, { models }, info) => {
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
  Query: {
    events: async (parent, args, { models }, info) => {
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
    createEvent: authGuard(
      async (parent, { event }, { models, currentUser }, info) => {
        const newEvent = await currentUser.createEvent({
          title: event.title,
          description: event.description,
          price: event.price,
          date: event.date
        });

        return newEvent;
      }
    )
  }
};
