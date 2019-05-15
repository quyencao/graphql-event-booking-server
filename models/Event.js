const event = (sequelize, DataTypes) => {
  const Event = sequelize.define("event", {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  Event.associate = models => {
    Event.belongsTo(models.User);

    Event.belongsToMany(models.User, { through: models.Booking });
  };

  return Event;
};

export default event;
