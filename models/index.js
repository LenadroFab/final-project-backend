// backend/models/index.js
const sequelize = require("../db");

// IMPORT MODEL (SATU-SATU, JELAS)
const User = require("./User");
const Product = require("./Product");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const Payment = require("./Payment");

// INIT MODEL (SATU KALI)
User.initModel(sequelize);
Product.initModel(sequelize);
Order.initModel(sequelize);
OrderItem.initModel(sequelize);
Payment.initModel(sequelize);

// INIT RELATIONS (SATU KALI)
User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

Product.hasMany(OrderItem);
OrderItem.belongsTo(Product);

Order.hasOne(Payment);
Payment.belongsTo(Order);

console.log("🔗 Model relationships initialized successfully!");

module.exports = {
  sequelize,
  User,
  Product,
  Order,
  OrderItem,
  Payment,
};
