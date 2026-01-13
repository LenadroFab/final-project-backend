// backend/models/Payment.js
const { Model, DataTypes } = require("sequelize");

class Payment extends Model {
  static initModel(sequelize) {
    Payment.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        order_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        method: {
          type: DataTypes.ENUM("cash", "transfer", "ewallet"),
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM("pending", "completed", "failed"),
          allowNull: false,
          defaultValue: "pending",
        },
      },
      {
        sequelize,
        modelName: "Payment",
        tableName: "payments",
        timestamps: true,
      }
    );
  }
}

module.exports = Payment;
