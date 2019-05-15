import Sequelize from "sequelize";
import path from "path";

import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres"
  }
);

const models = {
  Event: sequelize.import(path.join(__dirname, "models", "Event.js")),
  User: sequelize.import(path.join(__dirname, "models", "User.js")),
  Booking: sequelize.import(path.join(__dirname, "models", "Booking.js"))
};

Object.keys(models).forEach(key => {
  if ("associate" in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;
