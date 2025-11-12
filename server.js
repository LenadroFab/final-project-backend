// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");

// ✅ Ambil semua model yang sudah diinisialisasi dari ./models/index.js
const { sequelize, User, Order, OrderItem, Product, Payment } = require("./models");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// ==============================
// 🔧 MIDDLEWARES
// ==============================
app.use(cors());
app.use(express.json());

// 🖼️ Serve folder uploads (gambar produk)
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
  console.log("📂 Folder 'uploads' dibuat otomatis");
}

// ==============================
// 🚀 ROUTES
// ==============================
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);

app.get("/", (req, res) =>
  res.json({ message: "☕ KopiKuKopi Backend API berjalan lancar di Railway!" })
);

// ==============================
// 🧩 DATABASE SYNC & SERVER START
// ==============================
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Railway PostgreSQL");

    await sequelize.sync({ alter: true });
    console.log("✅ Database synchronized");

    // === Seed akun default ===
    const seedUser = async (username, password, role) => {
      const exist = await User.findOne({ where: { username } });
      if (!exist) {
        const hashed = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashed, role });
        console.log(`👤 Akun ${role} dibuat: ${username}/${password}`);
      }
    };

    await seedUser("admin", "admin123", "admin");
    await seedUser("kasir", "kasir123", "kasir");
    await seedUser("customer", "cust123", "customer");

    app.listen(PORT, () => {
      console.log(`🚀 Server berjalan di PORT ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Gagal koneksi ke database Railway:", error.message);
  }
})();
