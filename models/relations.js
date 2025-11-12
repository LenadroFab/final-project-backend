// backend/models/relations.js
module.exports = (db) => {
  const { User, Product, Order, OrderItem, Payment } = db;

  if (!User || !Order || !Product || !OrderItem || !Payment) {
    console.warn("⚠️ Some models not loaded yet — skipping relations setup.");
    return;
  }

  /* ====================================================
     🔗 USER & ORDER
     ==================================================== */
  User.hasMany(Order, {
    foreignKey: "user_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Order.belongsTo(User, {
    foreignKey: "user_id",
  });

  /* ====================================================
     🔗 ORDER & ORDER ITEM
     ==================================================== */
  Order.hasMany(OrderItem, {
    foreignKey: "order_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  OrderItem.belongsTo(Order, {
    foreignKey: "order_id",
  });

  /* ====================================================
     🔗 PRODUCT & ORDER ITEM
     ==================================================== */
  Product.hasMany(OrderItem, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  OrderItem.belongsTo(Product, {
    foreignKey: "product_id",
  });

  /* ====================================================
     🔗 ORDER & PAYMENT
     ==================================================== */
  Order.hasOne(Payment, {
    foreignKey: "order_id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  Payment.belongsTo(Order, {
    foreignKey: "order_id",
  });

  console.log("🔗 Model relationships initialized successfully!");
};
