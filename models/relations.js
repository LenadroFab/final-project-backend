function initRelations(db) {
  const { User, Product, Order, OrderItem, Payment } = db;

  console.log("🔍 Loaded models:", Object.keys(db));

  if (User && Order) {
    User.hasMany(Order, { foreignKey: "user_id", onDelete: "CASCADE" });
    Order.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE" });
  }

  if (Order && OrderItem) {
    Order.hasMany(OrderItem, { foreignKey: "order_id", onDelete: "CASCADE" });
    OrderItem.belongsTo(Order, { foreignKey: "order_id", onDelete: "CASCADE" });
  }

  if (Product && OrderItem) {
    Product.hasMany(OrderItem, { foreignKey: "product_id", onDelete: "CASCADE" });
    OrderItem.belongsTo(Product, { foreignKey: "product_id", onDelete: "CASCADE" });
  }

  if (Order && Payment) {
    Order.hasOne(Payment, { foreignKey: "order_id", onDelete: "CASCADE" });
    Payment.belongsTo(Order, { foreignKey: "order_id", onDelete: "CASCADE" });
  }

  if (User && Payment) {
    User.hasMany(Payment, { foreignKey: "user_id", onDelete: "SET NULL" });
    Payment.belongsTo(User, { foreignKey: "user_id", onDelete: "SET NULL" });
  }

  console.log("🔗 Model relationships initialized successfully!");
}

module.exports = initRelations;
