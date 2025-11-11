// backend/models/Product.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Tanpa Nama",
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "products",
      timestamps: true,
    }
  );

  // 🔗 asosiasi jika nanti dibutuhkan
  Product.associate = (models) => {
    // contoh:
    // Product.belongsTo(models.User, { foreignKey: "created_by" });
    // Product.hasMany(models.OrderItem, { foreignKey: "product_id" });
  };

  return Product;
};
