export default {
  Event: {
    async creator(parent, args, { models }, info) {
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
    async events(parent, args, { models }, info) {
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
    async createEvent(parent, { event }, { models }, info) {
      const user = await models.User.findByPk(1);

      const newEvent = await user.createEvent({
        title: event.title,
        description: event.description,
        price: event.price,
        date: event.date
      });

      return newEvent;
    }
  }
};
