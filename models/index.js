const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const db = {};

let sequelize;

// ✅ Gunakan Railway DATABASE_URL jika tersedia (production)
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // penting untuk koneksi SSL Railway
      },
    },
  });
  console.log("✅ Using DATABASE_URL (Railway)");
} else {
  // ✅ Gunakan config.json untuk lokal (Docker / dev)
  const config = require(path.join(__dirname, "../config/config.json"))[env];
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
  console.log("✅ Using local config/config.json");
}

// 🔍 Auto-load semua file model di folder ini
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const modelFactory = require(path.join(__dirname, file));
    const model = modelFactory(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// 🔗 Hubungkan relasi antar model (jika ada)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
