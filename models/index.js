// backend/models/index.js
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

const basename = path.basename(__filename);
const db = {};

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not found. Please set it in Railway Variables.");
  process.exit(1);
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false },
  },
  logging: false,
});

console.log("✅ Connected to Railway PostgreSQL");

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file !== "relations.js" &&
      file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const modelPath = path.join(__dirname, file);

    try {
      const modelModule = require(modelPath);
      let model;

      if (typeof modelModule === "function") {
        model = modelModule(sequelize, Sequelize.DataTypes);
      } else if (
        modelModule instanceof Sequelize.Model ||
        modelModule?.prototype instanceof Sequelize.Model
      ) {
        model = modelModule;
      } else {
        console.warn(`⚠️ Skip '${file}' — not a Sequelize model export.`);
        return;
      }

      db[model.name] = model;
    } catch (err) {
      console.error(`❌ Error loading model '${file}':`, err.message);
    }
  });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

try {
  const initRelations = require("./relations");
  initRelations(db);
} catch (err) {
  console.warn("⚠️ Could not load relations:", err.message);
}

module.exports = db;
