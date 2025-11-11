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
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
  console.log("✅ Using local config/config.json");
}

// 🔥 FIX untuk support class-based dan function-based model
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const modelFile = require(path.join(__dirname, file));

    let model;
    if (typeof modelFile === "function") {
      // model gaya lama: module.exports = (sequelize, DataTypes) => {...}
      model = modelFile(sequelize, Sequelize.DataTypes);
    } else {
      // model gaya baru: module.exports = class User extends Model {...}
      model = modelFile;
      if (model.init) {
        model.init(model.fields || {}, { sequelize, modelName: model.name });
      }
    }

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
