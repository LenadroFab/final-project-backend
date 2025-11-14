// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const { sequelize, User } = require("./models");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// ===============================
// 🚀 FIX PALING PENTING
// ===============================
app.use(cors());
app.use(express.json({ limit: "50mb" }));                // <--- WAJIB ADA
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // <--- WAJIB ADA
// ===============================

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);

app.get("/", (req, res) =>
  res.json({ message: "Backend KopiKuKopi running on Railway" })
);

// DATABASE & SERVER START
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Railway PostgreSQL");

    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized");

    // SEED USER
    const seedUser = async (username, password, role) => {
      const exist = await User.findOne({ where: { username } });
      if (!exist) {
        const hashed = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashed, role });
        console.log(`👤 User dibuat: ${username}/${password}`);
      }
    };

    await seedUser("admin", "admin123", "admin");
    await seedUser("kasir", "kasir123", "kasir");
    await seedUser("customer", "cust123", "customer");

    app.listen(PORT, () =>
      console.log(`🚀 Server berjalan di PORT ${PORT}`)
    );
  } catch (err) {
    console.error("❌ DB Error:", err.message);
  }
})();
