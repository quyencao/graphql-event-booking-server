export default {
  Booking: {
    async user(parent, args, { models }, info) {
      const user = await models.User.findOne({
        where: {
          id: parent.userId
        },
        attributes: {
          exclude: ["password"]
        }
      });

      return user;
    },
    async event(parent, args, { models }, info) {
      const event = await models.Event.findByPk(parent.eventId);
      return event;
    }
  },
  Query: {
    async bookings(parent, args, { models }, info) {
      const bookings = await models.Booking.findAll();

      return bookings.map(booking => {
        return {
          ...booking.dataValues,
          createdAt: new Date(booking.createdAt).toISOString(),
          updatedAt: new Date(booking.updatedAt).toISOString()
        };
      });
    }
  },
  Mutation: {
    async bookEvent(parent, { eventId }, { models }, info) {
      const user = await models.User.findByPk(2);
      const event = await models.Event.findByPk(eventId);

      await event.addUser(user, { through: { status: "ACTIVE" } });
      const booking = await models.Booking.findOne({
        where: {
          userId: 2,
          eventId
        }
      });

      return booking;
    },
    async cancelBooking(parent, { bookingId }, { models }, info) {
      const booking = await models.Booking.findByPk(bookingId);
      booking.status = "CANCEL";
      await booking.save();
      const event = await models.Event.findByPk(booking.eventId);
      return event;
    }
  }
};
