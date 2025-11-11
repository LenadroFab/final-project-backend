// backend/models/User.js
module.exports = (sequelize, DataTypes) => {
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
        validate: {
          len: [3, 50],
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false, // hash sebelum simpan
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
      underscored: false,
    }
  );

  // 🔗 asosiasi jika nanti dibutuhkan
  User.associate = (models) => {
    // contoh:
    // User.hasMany(models.Order, { foreignKey: "user_id" });
  };

  return User;
};
