// backend/models/Order.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const User = require("./user");

const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    status: {
      type: DataTypes.ENUM("pending", "paid", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

// Relasi
Order.belongsTo(User, { foreignKey: "user_id" });

module.exports = Order;
