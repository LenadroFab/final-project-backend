// backend/models/index.js
const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");

const basename = path.basename(__filename);
const db = {};

// ================================
// 🔌 CONNECT TO DATABASE (Railway)
// ================================
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL not found. Set it in Railway!");
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

console.log("🚀 Connected to Railway PostgreSQL");

// ================================
// 📌 LOAD ALL MODELS
// ================================
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file !== basename &&
      file !== "relations.js" &&
      file.endsWith(".js")
  )
  .forEach((file) => {
    const modelPath = path.join(__dirname, file);

    try {
      const modelFactory = require(modelPath);

      if (typeof modelFactory !== "function") {
        console.warn(`⚠ Model file skipped (not a factory): ${file}`);
        return;
      }

      const model = modelFactory(sequelize);

      if (!model || !model.name) {
        console.warn(`⚠ Model file invalid: ${file}`);
        return;
      }

      db[model.name] = model;
      console.log(`✅ Loaded model: ${model.name}`);

    } catch (err) {
      console.error(`❌ Error loading model '${file}':`, err.message);
    }
  });

// ================================
// 🔗 INIT RELATIONS
// ================================
try {
  const initRelations = require("./relations");
  initRelations(db);
  console.log("🔗 Model relationships initialized successfully!");
} catch (err) {
  console.error("❌ Failed to initialize relations:", err.message);
}

// ================================
// EXPORT
// ================================
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
