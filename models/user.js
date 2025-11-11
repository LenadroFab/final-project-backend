// backend/models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false, // harus di-hash sebelum disimpan
    },

    role: {
      type: DataTypes.ENUM("admin", "kasir", "customer"),
      allowNull: false,
      defaultValue: "customer",
    },
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: false,
  }
);

module.exports = User;
