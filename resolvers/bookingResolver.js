import authGuard from "../guards/authGuard";

export default {
  Booking: {
    user: async (parent, args, { models }, info) => {
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
    bookings: authGuard(async (parent, args, { models, currentUser }, info) => {
      const bookings = await models.Booking.findAll({
        where: {
          userId: currentUser.id
        }
      });

      return bookings.map(booking => {
        return {
          ...booking.dataValues,
          createdAt: new Date(booking.createdAt).toISOString(),
          updatedAt: new Date(booking.updatedAt).toISOString()
        };
      });
    })
  },
  Mutation: {
    bookEvent: authGuard(
      async (parent, { eventId }, { models, currentUser }, info) => {
        const event = await models.Event.findByPk(eventId);

        await event.addUser(currentUser, { through: { status: "ACTIVE" } });
        const booking = await models.Booking.findOne({
          where: {
            userId: currentUser.id,
            eventId
          }
        });

        return booking;
      }
    ),
    cancelBooking: authGuard(
      async (parent, { bookingId }, { models }, info) => {
        const booking = await models.Booking.findByPk(bookingId);
        booking.status = "CANCEL";
        await booking.save();
        const event = await models.Event.findByPk(booking.eventId);
        return event;
      }
    )
  }
};
