const user = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  User.associate = models => {
    User.hasMany(models.Event);

    User.belongsToMany(models.Event, { through: models.Booking });
  };

  return User;
};

export default user;
