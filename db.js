// backend/db.js
const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  protocol: "postgres",
  dialectOptions: {
    ssl: process.env.NODE_ENV === "production",
  },
  pool: {
    max: 3,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
