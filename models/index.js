// backend/models/index.js
const sequelize = require("../db");

// IMPORT MODEL (lowercase sesuai file)
const User = require("./user");
const Product = require("./product");
const Order = require("./order");
const OrderItem = require("./orderItem");
const Payment = require("./payment");

// INIT MODEL
User.initModel(sequelize);
Product.initModel(sequelize);
Order.initModel(sequelize);
OrderItem.initModel(sequelize);
Payment.initModel(sequelize);

// INIT RELATIONS
require("./relations")({
  User,
  Product,
  Order,
  OrderItem,
  Payment,
});

console.log("✅ Models & relations initialized");

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
  Payment,
};
