const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const db = {};

let config = {};
if (!process.env.DATABASE_URL) {
  config = require(path.join(__dirname, "../config/config.json"))[env];
}

let sequelize;

if (process.env.DATABASE_URL) {
  // ✅ Railway (Production)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
  console.log("✅ Using Railway DATABASE_URL");
} else {
  // ✅ Lokal (Docker/Dev)
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
  console.log("✅ Using local config/config.json");
}

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

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
