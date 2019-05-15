const booking = (sequelize, DataTypes) => {
  const Booking = sequelize.define("booking", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Booking;
};

export default booking;
