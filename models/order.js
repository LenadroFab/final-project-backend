// backend/models/Order.js
const { Model, DataTypes } = require("sequelize");

class Order extends Model {
  static initModel(sequelize) {
    Order.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },

        user_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },

        total_amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0.0,
        },

        status: {
          type: DataTypes.ENUM("pending", "paid", "cancelled"),
          allowNull: false,
          defaultValue: "pending",
        },

        customer_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        customer_email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: "Order",
        tableName: "orders",
        timestamps: true,
      }
    );
  }
}

module.exports = Order;
