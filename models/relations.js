// backend/models/relations.js

module.exports = (db) => {
  const { User, Order, OrderItem, Product, Payment } = db;

  // USER 🔗 ORDER
  User.hasMany(Order, { foreignKey: "user_id" });
  Order.belongsTo(User, { foreignKey: "user_id" });

  // ORDER 🔗 ORDER ITEMS
  Order.hasMany(OrderItem, { foreignKey: "order_id" });
  OrderItem.belongsTo(Order, { foreignKey: "order_id" });

  // PRODUCT 🔗 ORDER ITEMS
  Product.hasMany(OrderItem, { foreignKey: "product_id" });
  OrderItem.belongsTo(Product, { foreignKey: "product_id" });

  // PAYMENT 🔗 ORDER
  Payment.belongsTo(Order, { foreignKey: "order_id" });
  Order.hasMany(Payment, { foreignKey: "order_id" });

  // PAYMENT 🔗 USER
  Payment.belongsTo(User, { foreignKey: "user_id" });
  User.hasMany(Payment, { foreignKey: "user_id" });

  console.log("🔗 Model relationships initialized successfully!");
};
