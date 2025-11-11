// backend/models/relations.js
const User = require("./user");
const Product = require("./product");
const Order = require("./order");
const OrderItem = require("./orderItem");
const Payment = require("./payment");

/* ===============================================
   🔗 RELASI USER & ORDER
   =============================================== */
User.hasMany(Order, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Order.belongsTo(User, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

/* ===============================================
   🔗 RELASI ORDER & ORDER_ITEM
   =============================================== */
Order.hasMany(OrderItem, { foreignKey: "order_id", onDelete: "CASCADE" });
OrderItem.belongsTo(Order, { foreignKey: "order_id", onDelete: "CASCADE" });

/* ===============================================
   🔗 RELASI PRODUCT & ORDER_ITEM
   =============================================== */
Product.hasMany(OrderItem, { foreignKey: "product_id", onDelete: "CASCADE" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", onDelete: "CASCADE" });

/* ===============================================
   🔗 RELASI ORDER & PAYMENT
   =============================================== */
Order.hasOne(Payment, { foreignKey: "order_id", onDelete: "CASCADE" });
Payment.belongsTo(Order, { foreignKey: "order_id", onDelete: "CASCADE" });

/* ===============================================
   🔗 RELASI USER & PAYMENT
   =============================================== */
User.hasMany(Payment, { foreignKey: "user_id", onDelete: "SET NULL" });
Payment.belongsTo(User, { foreignKey: "user_id", onDelete: "SET NULL" });

/* ===============================================
   ⚙️ RELASI LOGIS (USER ↔ PRODUCT via ORDER)
   =============================================== */
// Tidak perlu belongsToMany, cukup nested include

module.exports = { User, Product, Order, OrderItem, Payment };
