// backend/models/Payment.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Order = require("./order");
const User = require("./user");

const Payment = sequelize.define(
  "Payment",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    method: {
      type: DataTypes.ENUM("cash", "qris", "transfer"),
      defaultValue: "cash",
    },
    status: {
      type: DataTypes.ENUM("pending", "success", "failed"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "payments",
    timestamps: true,
  }
);

// Relasi
Payment.belongsTo(Order, { foreignKey: "order_id" });
Payment.belongsTo(User, { foreignKey: "user_id" });

module.exports = Payment;
