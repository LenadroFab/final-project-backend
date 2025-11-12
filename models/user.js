// backend/models/user.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "kasir", "customer"),
        allowNull: false,
        defaultValue: "customer",
      },
    },
    {
      tableName: "users",
      timestamps: true,
    }
  );

  // 🔗 Relasi opsional (aktifkan jika nanti diperlukan)
  User.associate = (models) => {
    // Contoh:
    // User.hasMany(models.Order, { foreignKey: "user_id" });
  };

  return User;
};
