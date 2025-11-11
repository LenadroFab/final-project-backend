// backend/models/Product.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Tanpa Nama",
    },
    // 🔽 ubah ke DECIMAL agar bisa menerima harga 20000.00
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    image: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

module.exports = Product;
